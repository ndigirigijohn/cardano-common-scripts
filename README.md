# Cardano Common Snippets

> Executable code snippets for common Cardano development tasks

Stop writing the same Cardano code over and over. Clone this repo, run a snippet, get results.

Every snippet comes in **two flavors**:
- 🟦 **Node.js (JavaScript/TypeScript)** - For applications and automation
- 🟧 **cardano-cli** (Bash) - For scripts and maximum security

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/ndigirigijohn/cardano-common-snippets
cd cardano-common-snippets

# Install dependencies (for JavaScript snippets)
npm install

# Set up environment
cp .env.example .env
# Edit .env and add your Blockfrost API keys
# Optionally set DEFAULT_NETWORK to preview/mainnet

# Run a snippet
./snippets/wallet/generate.sh --network preprod
# or
npm run wallet:generate -- --network preprod
```

**That's it!** You now have executable snippets for every common Cardano task.

---

## 📦 What's Inside

### **30+ Executable Snippets** across 6 categories:

| Category | Snippets | What You Can Do |
|----------|----------|-----------------|
| **Wallet Operations** | 6 snippets | Generate, restore, check balance, list UTxOs, export keys |
| **Transactions** | 6 snippets | Send ADA, send tokens, batch payments, add metadata |
| **NFTs & Tokens** | 6 snippets | Mint NFTs, mint collections, burn tokens, query info |
| **Smart Contracts** | 5 snippets | Lock funds, unlock funds, query scripts, deploy validators |
| **Debugging** | 4 snippets | Decode transactions, analyze failures, calculate min UTxO |
| **Advanced** | 3 snippets | Reference scripts, staking, withdrawals |

**Total: 30 snippets × 2 versions = 60 ready-to-use scripts**

See [SNIPPETS.md](SNIPPETS.md) for complete list with examples.

---

## 💡 How To Use

### **Option 1: Direct Execution**

Every snippet is a standalone executable:

```bash
# JavaScript version
./snippets/wallet/generate.js --network preprod --output outputs/wallet/wallet.json

# cardano-cli version
./snippets/wallet/generate.sh --network preprod --output ./outputs/wallet
```

### **Option 2: npm Scripts**

Convenient shortcuts via package.json:

```bash
npm run wallet:generate -- --network preprod
npm run wallet:balance -- addr_test1...
npm run tx:send -- --to addr_test1... --amount 10
npm run nft:mint -- --name "MyNFT" --image ipfs://...
```

### **Option 3: Copy-Paste**

Open any snippet, copy the code, modify to your needs:

```bash
# View the code
cat snippets/wallet/generate.js

# Copy relevant parts
# Modify for your use case
# Done!
```

---

## 📖 Examples

### Generate a Wallet

**JavaScript:**
```bash
./snippets/wallet/generate.js --network preprod --output outputs/wallet/wallet.json
```

**cardano-cli:**
```bash
./snippets/wallet/generate.sh --network preprod --output ./outputs/wallet
```

### Check Balance

**JavaScript:**
```bash
./snippets/wallet/balance.js addr_test1qqxy... --network preprod
```

**cardano-cli:**
```bash
./snippets/wallet/balance.sh addr_test1qqxy... --network preprod
```

### Send ADA

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

### Mint an NFT

**JavaScript:**
```bash
./snippets/nft/mint-nft.js \
  --name "My First NFT" \
  --image "ipfs://Qm..." \
  --from wallet.json \
  --network preprod
```

**cardano-cli:**
```bash
./snippets/nft/mint-nft.sh \
  --name "My First NFT" \
  --metadata metadata.json \
  --from ./wallet-keys \
  --network preprod
```

---

## ⚙️ Setup

### Prerequisites

**For JavaScript snippets:**
- Node.js v18+ 
- npm or yarn
- Blockfrost API key ([get free key](https://blockfrost.io))

**For cardano-cli snippets:**
- cardano-cli installed ([installation guide](https://developers.cardano.org/docs/get-started/installing-cardano-node))
- cardano-node (optional, for local queries)

### Installation

```bash
# Clone repository
git clone https://github.com/ndigirigijohn/cardano-common-snippets
cd cardano-common-snippets

# Install dependencies
npm install

# Make scripts executable
chmod +x snippets/**/*.sh
chmod +x snippets/**/*.js

# Configure environment
cp .env.example .env
```

### Environment Configuration

Edit `.env` and add your API keys:

```env
# Blockfrost API Keys (for JavaScript snippets)
BLOCKFROST_API_KEY_PREPROD=preprodYourApiKeyHere
BLOCKFROST_API_KEY_PREVIEW=previewYourApiKeyHere
BLOCKFROST_API_KEY_MAINNET=mainnetYourApiKeyHere

# Default network used when --network is omitted
DEFAULT_NETWORK=preprod
```

Update `DEFAULT_NETWORK` once and every snippet (Node.js or Bash) will default
to that network unless you pass `--network` explicitly.

---

## 📂 Project Structure

```
cardano-common-snippets/
├── snippets/
│   ├── wallet/              # Wallet operations
│   │   ├── generate.js
│   │   ├── generate.sh
│   │   ├── balance.js
│   │   ├── balance.sh
│   │   └── ...
│   │
│   ├── transactions/        # Send ADA and tokens
│   │   ├── send-ada.js
│   │   ├── send-ada.sh
│   │   └── ...
│   │
│   ├── nft/                # NFT minting
│   │   ├── mint-nft.js
│   │   ├── mint-nft.sh
│   │   └── ...
│   │
│   ├── validator/          # Smart contracts
│   │   ├── lock-funds.js
│   │   ├── lock-funds.sh
│   │   └── ...
│   │
│   └── debug/              # Debugging tools
│       ├── decode-tx.js
│       ├── decode-tx.sh
│       └── ...
│
├── lib/                    # Shared utilities
│   ├── lucid-helpers.js
│   └── cardano-cli-helpers.sh
│
├── examples/               # Complete workflows
│   ├── complete-nft-flow.md
│   └── dapp-deployment.md
│
├── outputs/                # Runtime artifacts (gitignored, see OUTPUT.md)
│   └── .gitkeep
│
├── .env.example
├── OUTPUT.md
├── package.json
├── README.md
├── SNIPPETS.md            # Complete snippet reference
└── PLAN.md                # Development plan
```

---

## 🎯 Common Use Cases

### Testing & Development
```bash
# Quick test wallet
./snippets/wallet/generate.sh --network preprod

# Check if funded
./snippets/wallet/balance.js addr_test1...

# Send test transaction
./snippets/transactions/send-ada.sh --to addr_test1... --amount 5
```

### CI/CD Automation
```bash
# In your deployment script
npm run wallet:generate -- --json > deployment-wallet.json
npm run validator:deploy -- --plutus validator.json
npm run tx:send -- --from deployment-wallet.json --to addr...
```

### NFT Projects
```bash
# Mint entire collection
for i in {1..100}; do
  ./snippets/nft/mint-nft.js \
    --name "Collection #$i" \
    --image "ipfs://.../$i.png" \
    --from wallet.json
done
```

### Smart Contract Testing
```bash
# Lock test funds
./snippets/validator/lock-funds.js \
  --validator vesting.json \
  --datum '{"deadline": 1735689600}' \
  --amount 50

# Later... unlock
./snippets/validator/unlock-funds.js \
  --validator vesting.json \
  --redeemer '{"action": "claim"}'
```

---

## 🔧 Customization

All snippets are designed to be:
- ✅ **Copy-paste friendly** - Take the code and modify it
- ✅ **Self-contained** - Each snippet works independently
- ✅ **Well-commented** - Understand what each part does
- ✅ **Production-ready** - Add error handling and you're good to go

### Example: Customize Send ADA

```javascript
// Start with the snippet
import sendAda from './snippets/transactions/send-ada.js';

// Customize for your needs
async function sendWithNotification(to, amount) {
  const txHash = await sendAda(to, amount);
  
  // Add your custom logic
  await notifyUser(txHash);
  await logToDatabase(txHash);
  
  return txHash;
}
```

---

## 📚 Documentation

- **[SNIPPETS.md](SNIPPETS.md)** - Complete list of all snippets with usage examples
- **[examples/](examples/)** - Complete workflow examples
- **Inline Comments** - Every snippet is well-documented
- **[OUTPUT.md](OUTPUT.md)** - Guidelines for the gitignored `outputs/` workspace

---

## 🤝 Contributing

Have a useful snippet? Add it!

1. Fork the repository
2. Add your snippet (both JavaScript and cardano-cli versions)
3. Test it on preprod
4. Update SNIPPETS.md
5. Submit a pull request

### Snippet Guidelines:
- Self-contained and executable
- Clear command-line arguments
- Helpful error messages
- Comments explaining key parts
- Works on preprod testnet

---

## ⚠️ Security Notes

**For JavaScript snippets:**
- Never commit `.env` with real API keys
- Never commit wallet files with real funds
- Use environment variables for sensitive data

**For cardano-cli snippets:**
- Never commit `.skey` files
- Add `*.skey` to `.gitignore`
- Keep signing keys on secure, offline machines for production

**General:**
- Test on testnet first (preprod/preview)
- Understand each snippet before running
- Double-check addresses before sending real funds
- Keep backups of mnemonics and keys

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

Free to use, modify, and distribute. No warranties provided.

---

## 🔗 Resources

- [Cardano Serialization Lib](https://github.com/Emurgo/cardano-serialization-lib)
- [cardano-cli Reference](https://developers.cardano.org/docs/get-started/cardano-cli)
- [Blockfrost API](https://blockfrost.io)
- [Cardano Testnet Faucet](https://docs.cardano.org/cardano-testnet/tools/faucet)

---

## 💬 Support

- **Issues:** [GitHub Issues](https://github.com/ndigirigijohn/cardano-common-snippets/issues)
- **Discussions:** [GitHub Discussions](https://github.com/ndigirigijohn/cardano-common-snippets/discussions)

---

**Made for developers, by developers** 🛠️
