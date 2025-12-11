 "use client";

import { useState } from "react";
const metrics = [
  { label: "Snippets", value: "60+", detail: "JS + CLI twins" },
  { label: "Networks", value: "3", detail: "Preview · Preprod · Mainnet" },
  { label: "Exec time", value: "<30s", detail: "wallet:generate" },
];

const scriptCatalog = [
  {
    title: "Wallet Operations",
    description: "Generate, restore, export and audit wallets.",
    actions: ["Generate keys", "Restore mnemonic", "Check balance"],
  },
  {
    title: "Transactions",
    description: "Send ADA, batch payouts, attach metadata.",
    actions: ["Send ADA", "Token transfers", "Batch payments"],
  },
  {
    title: "NFTs & Tokens",
    description: "Mint collections, burn tokens, inspect assets.",
    actions: ["Mint single", "Mint 100x loop", "Burn policy"],
  },
  {
    title: "Smart Contracts",
    description: "Lock/Unlock funds, deploy validators, test datum.",
    actions: ["Reference scripts", "Lock funds", "Redeem with datum"],
  },
];

const quickActions = [
  {
    title: "Wallet Generator",
    tag: "wallet:generate",
    description: "Create a fresh wallet, export JSON + key files.",
    command: "./scripts/wallet/generate.sh --network preprod",
    meta: "Outputs to outputs/wallet/",
  },
  {
    title: "Send ADA",
    tag: "tx:send",
    description: "Move funds with metadata in one command.",
    command:
      "npm run tx:send -- --from wallet.json --to addr_test1... --amount 10",
    meta: "Supports metadata + tokens",
  },
  {
    title: "Mint NFT",
    tag: "nft:mint",
    description: "Spin up a one-off asset with IPFS media.",
    command:
      "./scripts/nft/mint-nft.js --name CommonScript --image ipfs://... ",
    meta: "Puts policy + assetId in console",
  },
];

const networkOptions = ["Preprod", "Preview", "Mainnet"] as const;

const networkArgMap: Record<(typeof networkOptions)[number], string> = {
  Preprod: "preprod",
  Preview: "preview",
  Mainnet: "mainnet",
};

export default function Home() {
  const [selectedNetwork, setSelectedNetwork] = useState<(typeof networkOptions)[number]>("Preprod");
  const selectedNetworkArg = networkArgMap[selectedNetwork];
  const scriptCommand = `npm run wallet:generate -- --network ${selectedNetworkArg}`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-base)] text-white">
      <div className="background-grid" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="orb orb-three" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-10 md:px-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xl font-semibold text-[var(--primary-light)]">
              λ
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.42em] text-[var(--muted)]">
                Cardano Common
              </p>
              <p className="text-2xl font-semibold text-gradient">Scripts Console</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/ndigirigijohn/cardano-common-scripts"
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:border-white/30 hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              View Repo
            </a>
            <a
              href="https://github.com/ndigirigijohn/cardano-common-scripts/blob/main/README.md"
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-white/20"
              target="_blank"
              rel="noreferrer"
            >
              Documentation
            </a>
          </div>
        </header>

        <main className="mt-10 flex flex-col gap-12">
          <section className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
            <div className="glass-panel glow-ring p-8">
              <span className="badge text-[var(--primary-light)]">
                Executable scripts
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
                Common scripts for Cardano development.
              </h1>
              <p className="mt-4 max-w-xl text-lg text-[var(--text-secondary)]">
                Wallet, transaction, NFT and validator snippets live here. Choose one, set the network, copy the command, watch the artifacts drop into <code>outputs/</code>.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#quick-launch"
                  className="rounded-full bg-gradient-to-r from-[#00C2FF] to-[#0074A6] px-5 py-3 text-sm font-semibold text-[#0B121B] shadow-[0_18px_40px_rgba(0,194,255,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(0,194,255,0.35)]"
                >
                  Jump to launcher
                </a>
                <a
                  href="https://github.com/ndigirigijohn/cardano-common-scripts/blob/main/SNIPPETS.md"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:text-[var(--primary-light)]"
                >
                  Browse all snippets
                </a>
              </div>

              <div className="mt-8 grid gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-[var(--text-secondary)] sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {metric.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div id="quick-launch" className="glass-panel glow-ring flex flex-col gap-6 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
                    Quick launcher
                  </p>
                  <p className="text-lg font-semibold">wallet:generate</p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
                  {selectedNetwork}
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  Network
                </p>
                <div className="grid grid-cols-3 gap-2 text-sm font-semibold">
                  {networkOptions.map((network) => (
                    <button
                      key={network}
                      type="button"
                      onClick={() => setSelectedNetwork(network)}
                      className={`rounded-xl border px-3 py-2 transition ${
                        network === selectedNetwork
                          ? "border-transparent bg-gradient-to-r from-[#14F195] to-[#00C2FF] text-[#0B121B]"
                          : "border-white/10 bg-white/5 text-[var(--text-secondary)] hover:border-white/30 hover:text-white"
                      }`}
                      aria-pressed={network === selectedNetwork}
                    >
                      {network}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-[var(--text-secondary)]">
                    Script
                  </p>
                  <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white">
                    {scriptCommand}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-secondary)]">
                    Output
                  </p>
                  <pre className="mt-2 max-h-44 overflow-auto rounded-2xl border border-[#2C3440] bg-[#06090F] p-4 text-xs font-mono text-[#5EE3FF]">
{`> lucid wallet:generate --network ${selectedNetworkArg}
✔ keys exported to outputs/wallet
✔ address: addr_test1qq...v9en

Next: fund via faucet, then run tx:send`}
                  </pre>
                </div>
              </div>

              <div className="divider" />

              <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                <span className="rounded-full border border-white/10 px-3 py-1 text-white">
                  JSON + .skey ready
                </span>
                <span>Deterministic outputs · audit friendly</span>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
              Script catalog
            </p>
            <h2 className="text-3xl font-semibold">Pick a starting point</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {scriptCatalog.map((category) => (
                <div
                  key={category.title}
                  className="glass-panel flex flex-col gap-4 border-white/5 p-6 transition hover:border-white/15"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                      {category.actions.length} flows
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {category.description}
                  </p>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                    {category.actions.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
              Sample commands
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Copy, paste, run</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {quickActions.map((action) => (
                <div
                  key={action.tag}
                  className="rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:border-white/20"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
                    {action.tag}
                  </p>
                  <p className="mt-1 text-lg font-semibold">{action.title}</p>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    {action.description}
                  </p>
                  <p className="mt-3 rounded-xl border border-dashed border-white/20 bg-black/30 px-3 py-2 font-mono text-xs text-[#5EE3FF]">
                    {action.command}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="mt-12 border-t border-white/5 pt-6 text-sm text-[var(--muted)]">
          <p>
            Built with ❤️ for developers automating Cardano. Follow the plan in{" "}
            <a
              href="https://github.com/ndigirigijohn/cardano-common-scripts/blob/main/PLAN.md"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--primary-light)] underline-offset-4 hover:underline"
            >
              PLAN.md
            </a>{" "}
            to extend this UI.
          </p>
        </footer>
      </div>
    </div>
  );
}
