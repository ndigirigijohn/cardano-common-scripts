#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

DEFAULT_NETWORK_VALUE="${DEFAULT_NETWORK:-preprod}"
DEFAULT_OUTPUT_REL="outputs/wallet"
DEFAULT_OUTPUT_DIR="$PROJECT_ROOT/$DEFAULT_OUTPUT_REL"

NETWORK="$DEFAULT_NETWORK_VALUE"
OUT_DIR="$DEFAULT_OUTPUT_DIR"
FORCE="false"

usage() {
  cat <<EOF
Generate a fresh Cardano wallet (payment + stake keys) using cardano-cli.

Usage:
  ./snippets/wallet/generate.sh [options]

Options:
  -n, --network <network>   Network to target: preprod, preview, or mainnet (default: ${DEFAULT_NETWORK_VALUE})
  -o, --output <dir>        Directory to store the generated keys (default: ${DEFAULT_OUTPUT_REL})
  -f, --force               Overwrite existing files in the output directory
  -h, --help                Show this help message
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -n|--network)
      NETWORK="$2"
      shift 2
      ;;
    -o|--output)
      OUT_DIR="$2"
      shift 2
      ;;
    -f|--force)
      FORCE="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if ! command -v cardano-cli >/dev/null 2>&1; then
  echo "cardano-cli is required but not installed or on PATH." >&2
  exit 1
fi

NETWORK_LOWER="${NETWORK,,}"
case "$NETWORK_LOWER" in
  preprod|preview|mainnet) ;;
  *)
    echo "Unsupported network: $NETWORK" >&2
    exit 1
    ;;
esac

declare -a NETWORK_ARGS
case "$NETWORK_LOWER" in
  mainnet)
    NETWORK_ARGS=(--mainnet)
    ;;
  preprod)
    NETWORK_ARGS=(--testnet-magic 1)
    ;;
  preview)
    NETWORK_ARGS=(--testnet-magic 2)
    ;;
esac

umask 077
mkdir -p "$OUT_DIR"
OUT_DIR="$(cd "$OUT_DIR" && pwd)"

PAYMENT_VKEY="$OUT_DIR/payment.vkey"
PAYMENT_SKEY="$OUT_DIR/payment.skey"
PAYMENT_ADDR_FILE="$OUT_DIR/base.addr"
ENTERPRISE_ADDR_FILE="$OUT_DIR/enterprise.addr"

STAKE_VKEY="$OUT_DIR/stake.vkey"
STAKE_SKEY="$OUT_DIR/stake.skey"
STAKE_ADDR_FILE="$OUT_DIR/stake.addr"

OUTPUT_FILES=(
  "$PAYMENT_VKEY" "$PAYMENT_SKEY" "$PAYMENT_ADDR_FILE" "$ENTERPRISE_ADDR_FILE"
  "$STAKE_VKEY" "$STAKE_SKEY" "$STAKE_ADDR_FILE"
)

if [[ "$FORCE" != "true" ]]; then
  for file in "${OUTPUT_FILES[@]}"; do
    if [[ -e "$file" ]]; then
      echo "File already exists: $file (use --force to overwrite)." >&2
      exit 1
    fi
  done
else
  rm -f "${OUTPUT_FILES[@]}"
fi

echo "Generating payment key pair..."
cardano-cli address key-gen \
  --verification-key-file "$PAYMENT_VKEY" \
  --signing-key-file "$PAYMENT_SKEY"

echo "Generating stake key pair..."
cardano-cli stake-address key-gen \
  --verification-key-file "$STAKE_VKEY" \
  --signing-key-file "$STAKE_SKEY"

echo "Building addresses..."
cardano-cli address build \
  --payment-verification-key-file "$PAYMENT_VKEY" \
  --stake-verification-key-file "$STAKE_VKEY" \
  "${NETWORK_ARGS[@]}" \
  --out-file "$PAYMENT_ADDR_FILE"

cardano-cli address build \
  --payment-verification-key-file "$PAYMENT_VKEY" \
  --address-type enterprise \
  "${NETWORK_ARGS[@]}" \
  --out-file "$ENTERPRISE_ADDR_FILE"

cardano-cli stake-address build \
  --stake-verification-key-file "$STAKE_VKEY" \
  "${NETWORK_ARGS[@]}" \
  --out-file "$STAKE_ADDR_FILE"

echo "Wallet files stored in: $OUT_DIR"
echo "   • Base address:       $(cat "$PAYMENT_ADDR_FILE")"
echo "   • Enterprise address: $(cat "$ENTERPRISE_ADDR_FILE")"
echo "   • Stake address:      $(cat "$STAKE_ADDR_FILE")"
echo "Warning: Keep *.skey files offline and never commit them to version control."

