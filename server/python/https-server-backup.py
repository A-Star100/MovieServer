import http.server
import ssl
import os
from urllib.parse import urlparse

# Custom request handler to block certain directories
class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    # Cache landing page content to avoid reading from disk repeatedly
    landing_page_content = None

    def do_GET(self):
        parsed_path = urlparse(self.path).path
        
        # Block access to specific paths immediately
        if parsed_path.startswith('/certs/') or parsed_path == '/server.js' or parsed_path == '/python/https-server-backup.py' or parsed_path == '/mainlinejcdbme.js':
            self.send_response(403)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.replace(b'403 Forbidden: Access to this resource is blocked.')
            return
        
        # If it's the root path, serve the custom landing page
        if self.path == '/':
            self.serve_landing_page()
        else:
            # Proceed with normal handling for other paths
            super().do_GET()

    def serve_landing_page(self):
        if self.landing_page_content is None:
            landing_page_path = 'py.html'

            # Read and cache the landing page content
            if os.path.exists(landing_page_path):
                try:
                    with open(landing_page_path, 'r') as file:
                        self.landing_page_content = file.read()
                except Exception as e:
                    self.send_error(500, f"Internal Server Error: {str(e)}")
                    return
            else:
                self.send_error(404, "Landing Page Not Found")
                return
        
        # Serve the cached landing page content
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(self.landing_page_content.encode('utf-8'))

# Define the server address and port
server_address = ('0.0.0.0', 4443)  # Listening on all interfaces on port 4443 for HTTPS

# Create the HTTP server
httpd = http.server.HTTPServer(server_address, CustomHTTPRequestHandler)

# Set up the SSL context for HTTPS (replace with actual cert and key paths)
cert_file = '/volume1/family/Anirudh/Misc/jcdbmeserver/certs/server.crt'  # Path to your SSL certificate
key_file = '/volume1/family/Anirudh/Misc/jcdbmeserver/certs/server.key'    # Path to your SSL key

# Wrap the server with SSL
httpd.socket = ssl.wrap_socket(httpd.socket, keyfile=key_file, certfile=cert_file, server_side=True)

# Start the server
print("HTTPS server is running on https://192.168.254.137:4443...")
httpd.serve_forever()
