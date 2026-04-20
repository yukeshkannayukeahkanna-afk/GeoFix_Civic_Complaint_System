#!/usr/bin/env python3
"""
GeoFix App - Simple Python HTTP Server
This script starts a local web server to test your PWA
"""

import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

PORT = 8080

# Change to the script's directory
os.chdir(Path(__file__).parent)

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add headers for PWA to work properly
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

print("=" * 60)
print("  GeoFix Mobile App - Development Server")
print("=" * 60)
print()
print(f"Starting server on http://localhost:{PORT}")
print()
print("To test PWA installation:")
print("1. Look for the 'Install App' button")
print("2. Or check browser address bar for install icon")
print("3. Click install and follow prompts")
print()
print("Press Ctrl+C to stop the server")
print("=" * 60)
print()

# Open browser
webbrowser.open(f'http://localhost:{PORT}')

# Start server
with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer stopped.")
