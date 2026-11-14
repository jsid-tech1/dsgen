#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
CERT_DIR="$ROOT/.local-https"
CERT_FILE="$CERT_DIR/localhost.crt"
KEY_FILE="$CERT_DIR/localhost.key"

if [ "${1:-}" = "--generate-cert" ] || [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
  mkdir -p "$CERT_DIR"
  openssl req -x509 -newkey rsa:2048 -sha256 -days 825 -nodes \
    -keyout "$KEY_FILE" -out "$CERT_FILE" \
    -subj "/C=IN/ST=Local/L=Local/O=DSGen/OU=Development/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
  echo "Created a local certificate at $CERT_FILE"
  echo "Trust it in macOS Keychain Access, then run this script again."
  exit 0
fi

exec python3 "$ROOT/local-https-server.py"
