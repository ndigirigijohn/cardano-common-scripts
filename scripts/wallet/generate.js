#!/usr/bin/env node

import "dotenv/config";
import { Command } from "commander";
import * as CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";
import { generateMnemonic, mnemonicToEntropy } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const HARDENED_OFFSET = 0x80000000;
const WORD_STRENGTH = {
  12: 128,
  15: 160,
  18: 192,
  21: 224,
  24: 256,
};

const NETWORK_CONFIG = {
  preprod: {
    networkId: CardanoWasm.NetworkInfo.testnet_preprod().network_id(),
    addressPrefix: "addr_test",
    stakePrefix: "stake_test",
  },
  preview: {
    networkId: CardanoWasm.NetworkInfo.testnet_preview().network_id(),
    addressPrefix: "addr_test",
    stakePrefix: "stake_test",
  },
  mainnet: {
    networkId: CardanoWasm.NetworkInfo.mainnet().network_id(),
    addressPrefix: "addr",
    stakePrefix: "stake",
  },
};

const DEFAULT_NETWORK = resolveDefaultNetwork();
const DEFAULT_OUTPUT_FILE = path.join("outputs", "wallet", "wallet.json");

const program = new Command();

program
  .name("wallet:generate")
  .description("Generate a fresh Cardano wallet (mnemonic, keys, addresses).")
  .option(
    "-n, --network <network>",
    "Network to derive addresses for (preprod, preview, mainnet)",
    DEFAULT_NETWORK,
  )
  .option(
    "-o, --output <file>",
    "Path to write the wallet JSON file",
    DEFAULT_OUTPUT_FILE,
  )
  .option(
    "-w, --words <count>",
    "Mnemonic word count (12, 15, 18, 21, 24)",
    (value) => parseInt(value, 10),
    24,
  )
  .option("-f, --force", "Overwrite output file if it already exists", false)
  .parse();

const options = program.opts();

async function main() {
  try {
    const network = normalizeNetworkKey(options.network);
    const networkConfig = NETWORK_CONFIG[network];
    if (!networkConfig) {
      throw new Error(
        `Unsupported network "${options.network}". Use preprod, preview, or mainnet.`,
      );
    }

    const wordCount = Number(options.words);
    if (!WORD_STRENGTH[wordCount]) {
      throw new Error(
        `Unsupported word count "${options.words}". Choose one of ${Object.keys(WORD_STRENGTH).join(", ")}.`,
      );
    }

    const outputPath = path.resolve(process.cwd(), options.output);
    await ensureWritable(outputPath, options.force);

    const walletData = generateWallet({
      networkKey: network,
      wordCount,
      ...networkConfig,
    });

    await writeFile(outputPath, JSON.stringify(walletData, null, 2), "utf8");

    console.log("Wallet generated.");
    console.log(`   • Network: ${walletData.network}`);
    console.log(`   • Base address: ${walletData.addresses.base}`);
    console.log(`   • Reward address: ${walletData.addresses.reward}`);
    console.log(`   • File saved to: ${outputPath}`);
    console.log(
      "Warning: Never commit wallet files with real funds. Delete after use in production.",
    );
  } catch (error) {
    console.error("❌ Failed to generate wallet:");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

function generateWallet({ networkKey, networkId, addressPrefix, stakePrefix, wordCount }) {
  const mnemonic = generateMnemonic(wordlist, WORD_STRENGTH[wordCount]);
  const entropyBytes = mnemonicToEntropy(mnemonic, wordlist);
  const rootKey = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(
    entropyBytes,
    new Uint8Array(),
  );

  const accountKey = rootKey
    .derive(HARDENED_OFFSET + 1852)
    .derive(HARDENED_OFFSET + 1815)
    .derive(HARDENED_OFFSET + 0);

  const paymentKey = accountKey.derive(0).derive(0).to_raw_key();
  const stakeKey = accountKey.derive(2).derive(0).to_raw_key();

  const paymentCredential = CardanoWasm.Credential.from_keyhash(
    paymentKey.to_public().hash(),
  );
  const stakeCredential = CardanoWasm.Credential.from_keyhash(
    stakeKey.to_public().hash(),
  );

  const baseAddress = CardanoWasm.BaseAddress.new(
    networkId,
    paymentCredential,
    stakeCredential,
  )
    .to_address()
    .to_bech32(addressPrefix);

  const enterpriseAddress = CardanoWasm.EnterpriseAddress.new(
    networkId,
    paymentCredential,
  )
    .to_address()
    .to_bech32(addressPrefix);

  const rewardAddress = CardanoWasm.RewardAddress.new(
    networkId,
    stakeCredential,
  )
    .to_address()
    .to_bech32(stakePrefix);

  return {
    network: networkKey,
    mnemonic: {
      phrase: mnemonic,
      wordCount,
      language: "english",
    },
    derivationPath: "m/1852'/1815'/0'",
    addresses: {
      base: baseAddress,
      enterprise: enterpriseAddress,
      reward: rewardAddress,
    },
    keys: {
      rootPrivateKey: rootKey.to_bech32(),
      accountPublicKey: accountKey.to_public().to_bech32(),
      payment: {
        path: "m/1852'/1815'/0'/0/0",
        signingKey: paymentKey.to_bech32(),
        verificationKey: paymentKey.to_public().to_bech32(),
      },
      stake: {
        path: "m/1852'/1815'/0'/2/0",
        signingKey: stakeKey.to_bech32(),
        verificationKey: stakeKey.to_public().to_bech32(),
      },
    },
  };
}

function normalizeNetworkKey(value) {
  if (typeof value !== "string") return undefined;
  return value.trim().toLowerCase();
}

function resolveDefaultNetwork() {
  const envNetwork = normalizeNetworkKey(process.env.DEFAULT_NETWORK);
  if (envNetwork && NETWORK_CONFIG[envNetwork]) {
    return envNetwork;
  }
  return "preprod";
}

async function ensureWritable(filePath, force) {
  if (!force && (await fileExists(filePath))) {
    throw new Error(
      `File "${filePath}" already exists. Re-run with --force to overwrite it.`,
    );
  }

  await mkdir(path.dirname(filePath), { recursive: true });
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

main();

