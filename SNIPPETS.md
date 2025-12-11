# Complete Snippets Reference

All 30 snippets available in **cardano-common-scripts**, each with both Lucid and cardano-cli versions.

---

## 📑 Table of Contents

- [Wallet Operations](#wallet-operations) (6 snippets)
- [Transactions](#transactions) (6 snippets)
- [NFTs & Tokens](#nfts--tokens) (6 snippets)
- [Smart Contracts](#smart-contracts) (5 snippets)
- [Debugging](#debugging) (4 snippets)
- [Advanced](#advanced) (3 snippets)

---

## Wallet Operations

### 1. Generate Wallet
**Create a new Cardano wallet with mnemonic phrase**

**JavaScript:**
```bash
./snippets/wallet/generate.js --network preprod --output outputs/wallet/wallet.json
```

**cardano-cli:**
```bash
./snippets/wallet/generate.sh --network preprod --output ./outputs/wallet
```

**What it does:**
- Generates new cryptographic keys
- Creates payment and stake addresses
- Returns mnemonic phrase (Lucid) or key files (cardano-cli)

**Notes:**
- Defaults to the network defined in `.env` (`DEFAULT_NETWORK`).
- Writes artifacts under `outputs/wallet/` by default (gitignored).

**Use when:** Starting fresh, need new test wallet, creating user wallets

---

### 2. Restore Wallet
**Restore wallet from 24-word mnemonic phrase**

**JavaScript:**
```bash
./snippets/wallet/restore.js \
  --mnemonic "word1 word2 ... word24" \
  --network preprod \
  --output restored-wallet.json
```

**cardano-cli:**
```bash
# cardano-cli uses key files, not mnemonics
# Restore by importing existing .skey files
./snippets/wallet/import-keys.sh --keys-dir ./backup-keys
```

**What it does:**
- Recovers wallet from mnemonic (Lucid)
- Imports existing key files (cardano-cli)
- Derives addresses from recovered keys

**Use when:** Moving wallets between machines, recovering from backup

---

### 3. Check Balance
**Query wallet balance (ADA and all tokens)**

**JavaScript:**
```bash
./snippets/wallet/balance.js addr_test1qqxy... --network preprod --show-tokens
```

**cardano-cli:**
```bash
./snippets/wallet/balance.sh addr_test1qqxy... --network preprod
```

**What it does:**
- Queries all UTxOs at address
- Sums total ADA
- Lists all native tokens (if any)

**Use when:** Checking if wallet is funded, verifying transaction completion

---

### 4. List UTxOs
**List all unspent transaction outputs at an address**

**JavaScript:**
```bash
./snippets/wallet/utxos.js addr_test1qqxy... --network preprod --min-ada 5
```

**cardano-cli:**
```bash
./snippets/wallet/utxos.sh addr_test1qqxy... --network preprod
```

**What it does:**
- Lists all UTxOs with details
- Shows transaction hash, index, value
- Optionally filters by minimum ADA

**Use when:** Debugging transaction failures, checking UTxO structure, finding specific UTxO

---

### 5. Export Keys
**Export wallet keys in different formats**

**JavaScript:**
```bash
./snippets/wallet/export.js \
  --wallet wallet.json \
  --format bech32 \
  --include-private
```

**cardano-cli:**
```bash
./snippets/wallet/export.sh \
  --keys-dir ./wallet-keys \
  --format hex
```

**What it does:**
- Exports public/private keys
- Supports multiple formats (hex, bech32, JSON)
- Option to include or exclude private keys

**Use when:** Backing up wallets, importing to other tools, debugging

---

### 6. Consolidate UTxOs
**Merge multiple small UTxOs into one**

**JavaScript:**
```bash
./snippets/wallet/consolidate.js \
  --from wallet.json \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/wallet/consolidate.sh \
  --from ./wallet-keys \
  --network preprod
```

**What it does:**
- Combines all UTxOs into single output
- Reduces transaction fees for future transactions
- Cleans up wallet

**Use when:** Wallet has too many small UTxOs, reducing future transaction costs

---

## Transactions

### 7. Send ADA
**Send ADA to an address**

**JavaScript:**
```bash
./snippets/transactions/send-ada.js \
  --from wallet.json \
  --to addr_test1... \
  --amount 10 \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/transactions/send-ada.sh \
  --from ./wallet-keys \
  --to addr_test1... \
  --amount 10 \
  --network preprod
```

**What it does:**
- Builds transaction sending specified ADA
- Calculates and includes fees
- Signs and submits to network

**Use when:** Sending payments, funding addresses, testing transactions

---

### 8. Send Tokens
**Send native tokens or NFTs**

**JavaScript:**
```bash
./snippets/transactions/send-tokens.js \
  --from wallet.json \
  --to addr_test1... \
  --policy abc123... \
  --name "MyToken" \
  --amount 100 \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/transactions/send-tokens.sh \
  --from ./wallet-keys \
  --to addr_test1... \
  --tokens "abc123.MyToken:100" \
  --network preprod
```

**What it does:**
- Sends native tokens/NFTs
- Includes minimum ADA with tokens
- Handles multi-asset transactions

**Use when:** Transferring NFTs, sending custom tokens, marketplace transactions

---

### 9. Batch Payment
**Send to multiple addresses in one transaction**

**JavaScript:**
```bash
./snippets/transactions/batch-payment.js \
  --from wallet.json \
  --payments payments.json \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/transactions/batch-payment.sh \
  --from ./wallet-keys \
  --payments payments.json \
  --network preprod
```

**payments.json format:**
```json
[
  {"to": "addr_test1...", "amount": 10},
  {"to": "addr_test1...", "amount": 5},
  {"to": "addr_test1...", "amount": 15}
]
```

**What it does:**
- Sends to multiple recipients in single transaction
- Reduces fees compared to separate transactions
- Useful for airdrops, payroll

**Use when:** Distributing tokens to many addresses, airdrops, batch operations

---

### 10. Add Metadata
**Send transaction with metadata attached**

**JavaScript:**
```bash
./snippets/transactions/with-metadata.js \
  --from wallet.json \
  --to addr_test1... \
  --amount 5 \
  --metadata '{"msg": "Hello Cardano!"}' \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/transactions/with-metadata.sh \
  --from ./wallet-keys \
  --to addr_test1... \
  --amount 5 \
  --metadata-file metadata.json \
  --network preprod
```

**What it does:**
- Attaches JSON metadata to transaction
- Metadata stored permanently on-chain
- Can include any JSON structure

**Use when:** Recording data on-chain, certificate issuance, proof of existence

---

### 11. Estimate Fees
**Calculate transaction fees before sending**

**JavaScript:**
```bash
./snippets/transactions/estimate-fee.js \
  --from wallet.json \
  --to addr_test1... \
  --amount 10 \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/transactions/estimate-fee.sh \
  --from ./wallet-keys \
  --to addr_test1... \
  --amount 10 \
  --network preprod
```

**What it does:**
- Builds transaction without signing
- Calculates exact fee required
- Helps verify sufficient funds

**Use when:** Checking if you have enough ADA, planning transactions

---

### 12. Monitor Transaction
**Wait for transaction confirmation**

**JavaScript:**
```bash
./snippets/transactions/monitor.js \
  --tx-hash abc123... \
  --network preprod \
  --wait \
  --timeout 300
```

**cardano-cli:**
```bash
./snippets/transactions/monitor.sh \
  --tx-hash abc123... \
  --network preprod
```

**What it does:**
- Polls network for transaction status
- Waits for confirmation
- Shows progress and final status

**Use when:** Waiting for transaction to confirm, automated workflows

---

## NFTs & Tokens

### 13. Mint NFT
**Mint a single NFT with metadata**

**JavaScript:**
```bash
./snippets/nft/mint-nft.js \
  --name "My NFT" \
  --image "ipfs://Qm..." \
  --description "First NFT" \
  --from wallet.json \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/nft/mint-nft.sh \
  --name "My NFT" \
  --metadata metadata.json \
  --from ./wallet-keys \
  --network preprod
```

**What it does:**
- Creates one-shot minting policy (can only mint once)
- Mints single NFT with CIP-25 metadata
- Returns NFT policy ID and asset name

**Use when:** Creating unique NFTs, certificates, proof of ownership

---

### 14. Mint Collection
**Mint multiple NFTs in batches**

**JavaScript:**
```bash
./snippets/nft/mint-collection.js \
  --collection collection.json \
  --from wallet.json \
  --batch-size 10 \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/nft/mint-collection.sh \
  --collection collection.json \
  --from ./wallet-keys \
  --network preprod
```

**collection.json format:**
```json
[
  {"name": "NFT #1", "image": "ipfs://Qm1...", "rarity": "common"},
  {"name": "NFT #2", "image": "ipfs://Qm2...", "rarity": "rare"}
]
```

**What it does:**
- Mints multiple NFTs from collection
- Batches minting to optimize fees
- Tracks progress

**Use when:** Creating NFT collections, generative art projects

---

### 15. Mint Fungible Tokens
**Mint native tokens (not NFTs)**

**JavaScript:**
```bash
./snippets/nft/mint-tokens.js \
  --name "MyToken" \
  --amount 1000000 \
  --from wallet.json \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/nft/mint-tokens.sh \
  --name "MyToken" \
  --amount 1000000 \
  --from ./wallet-keys \
  --network preprod
```

**What it does:**
- Creates minting policy
- Mints specified amount of tokens
- Returns policy ID

**Use when:** Creating utility tokens, governance tokens, reward tokens

---

### 16. Burn Tokens
**Remove tokens from circulation**

**JavaScript:**
```bash
./snippets/nft/burn.js \
  --policy abc123... \
  --name "MyToken" \
  --amount 500 \
  --from wallet.json \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/nft/burn.sh \
  --policy abc123... \
  --name "MyToken" \
  --amount 500 \
  --from ./wallet-keys \
  --network preprod
```

**What it does:**
- Burns specified amount (negative minting)
- Reduces circulating supply
- Requires original policy keys

**Use when:** Reducing token supply, burning redeemed vouchers

---

### 17. Query Token Info
**Get information about a token**

**JavaScript:**
```bash
./snippets/nft/token-info.js \
  --policy abc123... \
  --name "MyToken" \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/nft/token-info.sh \
  --policy abc123... \
  --name "MyToken" \
  --network preprod
```

**What it does:**
- Queries token metadata
- Shows total supply
- Displays CIP-25 data if available

**Use when:** Verifying NFT metadata, checking token details

---

### 18. List Token Holders
**Find all addresses holding a specific token**

**JavaScript:**
```bash
./snippets/nft/token-holders.js \
  --policy abc123... \
  --name "MyToken" \
  --network preprod
```

**cardano-cli:**
```bash
# Requires db-sync or similar indexer
# Not available with standard cardano-cli
```

**What it does:**
- Queries all UTxOs containing the token
- Lists holder addresses and amounts
- Uses Blockfrost API (Lucid version)

**Use when:** Airdrops, token holder verification, analytics

---

## Smart Contracts

### 19. Lock Funds
**Lock ADA at a validator address**

**JavaScript:**
```bash
./snippets/validator/lock-funds.js \
  --validator vesting.json \
  --datum '{"beneficiary": "addr_test1...", "deadline": 1735689600}' \
  --amount 50 \
  --from wallet.json \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/validator/lock-funds.sh \
  --validator vesting.plutus \
  --datum datum.json \
  --amount 50 \
  --from ./wallet-keys \
  --network preprod
```

**What it does:**
- Sends ADA to script address
- Attaches inline datum
- Funds can only be unlocked per validator rules

**Use when:** Testing validators, escrow, time-locked funds

---

### 20. Unlock Funds
**Spend from a validator**

**JavaScript:**
```bash
./snippets/validator/unlock-funds.js \
  --validator vesting.json \
  --redeemer '{"action": "claim"}' \
  --utxo "abc123#0" \
  --to wallet.json \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/validator/unlock-funds.sh \
  --validator vesting.plutus \
  --redeemer redeemer.json \
  --utxo "abc123#0" \
  --to ./wallet-keys \
  --network preprod
```

**What it does:**
- Spends UTxO from script
- Provides redeemer to validator
- Validator must approve transaction

**Use when:** Claiming vested funds, executing smart contract logic

---

### 21. Query Script UTxOs
**List all UTxOs at a script address**

**JavaScript:**
```bash
./snippets/validator/query-script.js \
  --validator vesting.json \
  --network preprod \
  --show-datums
```

**cardano-cli:**
```bash
./snippets/validator/query-script.sh \
  --script-address addr_test1w... \
  --network preprod
```

**What it does:**
- Lists all UTxOs locked at script
- Shows inline datums
- Displays total locked value

**Use when:** Checking locked funds, debugging validators

---

### 22. Deploy Validator
**Deploy validator as reference script**

**JavaScript:**
```bash
./snippets/validator/deploy.js \
  --validator vesting.json \
  --from wallet.json \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/validator/deploy.sh \
  --validator vesting.plutus \
  --from ./wallet-keys \
  --network preprod
```

**What it does:**
- Stores validator on-chain as reference script
- Reduces transaction sizes for future uses
- Returns reference UTxO

**Use when:** Production deployments, optimizing transaction costs

---

### 23. Read Datum
**Extract and decode datum from UTxO**

**JavaScript:**
```bash
./snippets/validator/read-datum.js \
  --utxo "abc123#0" \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/validator/read-datum.sh \
  --utxo "abc123#0" \
  --network preprod
```

**What it does:**
- Fetches UTxO
- Extracts inline datum
- Decodes to JSON

**Use when:** Inspecting script state, debugging validators

---

## Debugging

### 24. Decode Transaction
**Decode CBOR transaction to human-readable format**

**JavaScript:**
```bash
./snippets/debug/decode-tx.js \
  --tx-hash abc123... \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/debug/decode-tx.sh \
  --tx-cbor "84a400..." \
  --network preprod
```

**What it does:**
- Decodes transaction CBOR
- Shows inputs, outputs, metadata
- Human-readable format

**Use when:** Understanding transaction structure, debugging

---

### 25. Analyze Failed Transaction
**Diagnose why a transaction failed**

**JavaScript:**
```bash
./snippets/debug/analyze-failed.js \
  --tx-hash abc123... \
  --network preprod
```

**cardano-cli:**
```bash
# Limited support - shows basic error
./snippets/debug/analyze-failed.sh \
  --tx-hash abc123... \
  --network preprod
```

**What it does:**
- Retrieves failure reason
- Suggests fixes
- Shows validator execution logs (if available)

**Use when:** Transaction fails, debugging smart contracts

---

### 26. Calculate Min UTxO
**Calculate minimum ADA required for a UTxO**

**JavaScript:**
```bash
./snippets/debug/min-utxo.js \
  --datum '{"value": "test"}' \
  --tokens "abc123.NFT:1"
```

**cardano-cli:**
```bash
./snippets/debug/min-utxo.sh \
  --datum datum.json \
  --tokens "abc123.NFT:1"
```

**What it does:**
- Calculates min ADA based on UTxO size
- Accounts for datum and tokens
- Uses current protocol parameters

**Use when:** Planning transactions, avoiding min UTxO errors

---

### 27. Check Script Size
**Verify validator size is within limits**

**JavaScript:**
```bash
./snippets/debug/script-size.js --validator vesting.json
```

**cardano-cli:**
```bash
./snippets/debug/script-size.sh --validator vesting.plutus
```

**What it does:**
- Measures script size in bytes
- Compares to network limit (16KB)
- Warns if approaching limit

**Use when:** Developing validators, optimizing script size

---

## Advanced

### 28. Create Reference Script
**Store script on-chain for reuse**

**JavaScript:**
```bash
./snippets/advanced/create-reference.js \
  --validator vesting.json \
  --from wallet.json \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/advanced/create-reference.sh \
  --validator vesting.plutus \
  --from ./wallet-keys \
  --network preprod
```

**What it does:**
- Creates UTxO with script attached
- Script can be referenced in future transactions
- Reduces transaction size/fees

**Use when:** Production deployments, high-frequency contracts

---

### 29. Delegate Stake
**Delegate ADA to a stake pool**

**JavaScript:**
```bash
./snippets/advanced/delegate.js \
  --from wallet.json \
  --pool pool1abc... \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/advanced/delegate.sh \
  --from ./wallet-keys \
  --pool pool1abc... \
  --network preprod
```

**What it does:**
- Registers stake key (if needed)
- Delegates to specified pool
- Earns staking rewards

**Use when:** Earning staking rewards, supporting stake pools

---

### 30. Withdraw Rewards
**Claim accumulated staking rewards**

**JavaScript:**
```bash
./snippets/advanced/withdraw-rewards.js \
  --from wallet.json \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/advanced/withdraw-rewards.sh \
  --from ./wallet-keys \
  --network preprod
```

**What it does:**
- Queries rewards balance
- Builds withdrawal transaction
- Transfers rewards to wallet

**Use when:** Claiming staking rewards periodically

---

## 🔖 Quick Reference

**Most Used Snippets:**
1. Generate Wallet (#1)
2. Check Balance (#3)
3. Send ADA (#7)
4. Mint NFT (#13)
5. Lock Funds (#19)

**For Testing:**
- Generate Wallet (#1)
- Check Balance (#3)
- Send ADA (#7)
- Monitor Transaction (#12)

**For NFT Projects:**
- Mint NFT (#13)
- Mint Collection (#14)
- Query Token Info (#17)
- Send Tokens (#8)

**For Smart Contracts:**
- Lock Funds (#19)
- Unlock Funds (#20)
- Query Script (#21)
- Read Datum (#23)

**For Debugging:**
- Decode Transaction (#24)
- Analyze Failed (#25)
- Calculate Min UTxO (#26)

---

*Last Updated: December 6, 2024*
