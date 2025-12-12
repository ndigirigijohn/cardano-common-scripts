"use client";

import { ChangeEvent, useMemo, useState } from "react";
import scriptsData from "../scripts.json";

const SNIPPETS_DOC =
  "https://github.com/ndigirigijohn/cardano-common-scripts/blob/main/SNIPPETS.md";

const metrics = [
  { label: "Snippets", value: "60+", detail: "JS + CLI twins" },
  { label: "Networks", value: "3", detail: "Preview · Preprod · Mainnet" },
  { label: "Exec time", value: "<30s", detail: "wallet:generate" },
];

type ScriptItem = (typeof scriptsData)[number];

const networkOptions = ["Preprod", "Preview", "Mainnet"] as const;

const networkArgMap: Record<(typeof networkOptions)[number], string> = {
  Preprod: "preprod",
  Preview: "preview",
  Mainnet: "mainnet",
};

const defaultScript =
  scriptsData.find((script) => script.id === "wallet-generate-js") ??
  scriptsData[0];

export default function Home() {
  const [selectedNetwork, setSelectedNetwork] = useState<(typeof networkOptions)[number]>("Preprod");
  const selectedNetworkArg = networkArgMap[selectedNetwork];
  const scriptCommand = `npm run wallet:generate -- --network ${selectedNetworkArg}`;
  const defaultOutput = `> lucid wallet:generate --network ${selectedNetworkArg}
✔ keys exported to outputs/wallet
✔ address: addr_test1qq...v9en

Next: fund via faucet, then run tx:send`;

  const [searchQuery, setSearchQuery] = useState(defaultScript?.title ?? "");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const filteredSnippets = useMemo<ScriptItem[]>(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return scriptsData;
    }

    return scriptsData.filter((snippet) => {
      const haystack = [
        snippet.title,
        snippet.description,
        snippet.command,
        snippet.output,
        snippet.category,
        snippet.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [searchQuery]);

  const [selectedScriptId, setSelectedScriptId] = useState<string>(
    defaultScript?.id ?? "",
  );

  const selectedScript =
    scriptsData.find((snippet) => snippet.id === selectedScriptId) ??
    defaultScript ??
    null;

  const formatCommandForNetwork = (command: string, networkArg: string) => {
    if (!command) return "";
    return command.replace(/--network\s+\w+/gi, `--network ${networkArg}`);
  };

  const displayCommand = selectedScript
    ? formatCommandForNetwork(selectedScript.command, selectedNetworkArg)
    : scriptCommand;

  const displayOutput = selectedScript?.output ?? defaultOutput;
  const trimmedQuery = searchQuery.trim();
  const showSuggestions =
    suggestionsOpen && trimmedQuery.length > 0 && filteredSnippets.length > 0;
  const suggestionItems = showSuggestions
    ? filteredSnippets.slice(0, 6)
    : [];

  const handleCopy = async (text: string, token: string) => {
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        throw new Error("Clipboard API unavailable");
      }

      await navigator.clipboard.writeText(text);
      setCopiedToken(token);
      window.setTimeout(() => {
        setCopiedToken((current) => (current === token ? null : current));
      }, 1800);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    setSuggestionsOpen(value.trim().length > 0);
  };

  const handleSnippetSelect = (snippet: ScriptItem) => {
    setSelectedScriptId(snippet.id);
    setSearchQuery(snippet.title);
    setSuggestionsOpen(false);
  };

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

        <main className="mt-10 flex flex-col gap-10">
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
                  className="rounded-full bg-gradient-to-r from-[#00C98C] to-[#007456] px-5 py-3 text-sm font-semibold text-[#041610] shadow-[0_18px_40px_rgba(0,201,140,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(0,201,140,0.35)]"
                >
                  Jump to launcher
                </a>
                <a
                  href={SNIPPETS_DOC}
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
                  <p className="text-lg font-semibold">
                    {selectedScript?.title ?? "wallet:generate"}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
                  {selectedNetwork}
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
                  Search commands
                </p>
                <div className="relative">
                  <label htmlFor="command-search" className="sr-only">
                    Search commands
                  </label>
                  <input
                    id="command-search"
                    type="search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setSuggestionsOpen(true)}
                    placeholder="Search wallet, tx, nft, validator..."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-[var(--muted)] focus:border-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]/30"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSuggestionsOpen(false);
                      }}
                      className="absolute inset-y-0 right-3 text-xs font-semibold text-[var(--primary-light)] transition hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                  {showSuggestions && (
                    <div className="absolute left-0 right-0 top-full z-10 mt-2 max-h-56 overflow-auto rounded-2xl border border-white/10 bg-[#050b10] shadow-[0_20px_45px_rgba(0,0,0,0.55)]">
                      {suggestionItems.map((snippet) => (
                        <button
                          key={snippet.id}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => handleSnippetSelect(snippet)}
                          className={`block w-full border-b border-white/5 px-4 py-3 text-left text-sm transition last:border-b-0 ${
                            snippet.id === selectedScriptId
                              ? "bg-white/10"
                              : "hover:bg-white/5"
                          }`}
                        >
                          <p className="font-semibold text-white">
                            {snippet.title}
                          </p>
                          <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
                            {snippet.category}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
                          ? "border-transparent bg-gradient-to-r from-[#19F28D] to-[#00C98C] text-[#041610]"
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
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                      Script
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          displayCommand,
                          `${selectedScript?.id ?? "quick"}-command`,
                        )
                      }
                      className="text-xs font-semibold text-[var(--primary-light)] transition hover:text-white"
                    >
                      {copiedToken === `${selectedScript?.id ?? "quick"}-command`
                        ? "Copied"
                        : "Copy"}
                    </button>
                  </div>
                  <pre className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white">
                    {displayCommand}
                  </pre>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                      Output
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          displayOutput,
                          `${selectedScript?.id ?? "quick"}-output`,
                        )
                      }
                      className="text-xs font-semibold text-[var(--primary-light)] transition hover:text-white"
                    >
                      {copiedToken === `${selectedScript?.id ?? "quick"}-output`
                        ? "Copied"
                        : "Copy"}
                    </button>
                  </div>
                  <pre className="mt-2 max-h-44 overflow-auto rounded-2xl border border-[#1f2c31] bg-[#050b10] p-4 text-xs font-mono text-[#4FF0B4]">
                    {displayOutput}
                  </pre>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-xs text-[var(--text-secondary)]">
                <p>
                  <span className="font-semibold text-white">Script:</span>{" "}
                  {selectedScript?.scriptPath ?? "scripts/wallet/generate.js"}
                </p>
                {selectedScript?.tags?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedScript.tags.map((tag) => (
                      <span
                        key={`${selectedScript.id}-tag-${tag}`}
                        className="rounded-full border border-white/10 px-3 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                {selectedScript?.docs && (
                  <p className="mt-3">
                    <a
                      href={selectedScript.docs}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--primary-light)] underline-offset-4 hover:underline"
                    >
                      View docs →
                    </a>
                  </p>
                )}
              </div>

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
