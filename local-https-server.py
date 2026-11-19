#!/usr/bin/env python3
"""Serve the DSGen static app over HTTPS for Firebase Auth local testing."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import ssl


ROOT = Path(__file__).resolve().parent
CERT_DIR = ROOT / ".local-https"
CERT_FILE = CERT_DIR / "localhost.crt"
KEY_FILE = CERT_DIR / "localhost.key"


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main():
    if not CERT_FILE.exists() or not KEY_FILE.exists():
        raise SystemExit(
            "HTTPS certificate missing. Run:\n"
            "  ./start-local-https.sh --generate-cert\n"
            "Then trust .local-https/localhost.crt in Keychain Access."
        )

    server = ThreadingHTTPServer(("127.0.0.1", 8443), partial(NoCacheHandler, directory=ROOT))
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(CERT_FILE, KEY_FILE)
    server.socket = context.wrap_socket(server.socket, server_side=True)
    print("DSGen is running at https://localhost:8443")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
