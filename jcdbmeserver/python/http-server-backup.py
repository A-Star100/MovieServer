import http.server
import os
from urllib.parse import unquote, urlparse

# Custom request handler to block certain directories and serve files
class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    # Cache landing page content to avoid reading from disk repeatedly
    landing_page_content = None

    def do_GET(self):
        try:
            parsed_path = urlparse(self.path).path

            # Decode the URL to handle spaces and special characters
            requested_path = unquote(parsed_path)

            # Remove leading '/' from the path
            if requested_path.startswith('/'):
                requested_path = requested_path[1:]

            # If the request is for a directory, serve index.html
            if not requested_path or requested_path.endswith('/'):
                requested_path += 'index.html'

            # Add .html if the file without extension is requested
            if not os.path.splitext(requested_path)[1]:
                requested_path += '.html'

            # Check if the file exists
            if os.path.exists(requested_path):
                self.path = '/' + requested_path
            else:
                self.send_error(404, "File not found")
                return

            # Block access to specific paths immediately
            if parsed_path.startswith('/certs/') or parsed_path == '/server.js' or parsed_path == '/python/https-server-backup.py' or parsed_path == '/mainlinejcdbme.js':
                self.send_response(403)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(b'403 Forbidden: Access to this resource is blocked.')
                return
            
            # If it's the root path, serve the custom landing page
            if parsed_path == '/':
                self.serve_landing_page()
            else:
                # Proceed with normal handling for other paths
                super().do_GET()

        except Exception as e:
            self.send_error(500, f"Internal Server Error: {str(e)}")
            print(f"Error: {str(e)}")  # Log the error message

    def serve_landing_page(self):
        try:
            if self.landing_page_content is None:
                landing_page_path = 'index.html'

                # Read and cache the landing page content
                if os.path.exists(landing_page_path):
                    with open(landing_page_path, 'r') as file:
                        self.landing_page_content = file.read()
                else:
                    self.send_error(404, "Landing Page Not Found")
                    return
            
            # Serve the cached landing page content
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(self.landing_page_content.encode('utf-8'))
        except Exception as e:
            self.send_error(500, f"Error serving landing page: {str(e)}")
            print(f"Error serving landing page: {str(e)}")  # Log the error message

# Define the server address and port
server_address = ('0.0.0.0', 4443)  # Listening on all interfaces on port 8000

# Create the HTTP server
try:
    httpd = http.server.HTTPServer(server_address, CustomHTTPRequestHandler)

    # Start the server
    print("HTTP server is running on http://0.0.0.0:8000...")
    httpd.serve_forever()
except Exception as e:
    print(f"Failed to start server: {str(e)}")
    exit(1)
