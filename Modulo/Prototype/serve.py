"""No-cache HTTP server for prototype serving."""
import http.server
import socketserver
import os

os.chdir('/Users/Frank/products/Modulo/Prototype')

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

with socketserver.TCPServer(('0.0.0.0', 8765), NoCacheHandler) as httpd:
    httpd.serve_forever()
