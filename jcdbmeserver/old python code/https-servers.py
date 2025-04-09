import http.server
import ssl
import socketserver
import threading
import os

# Set the ports for HTTP and HTTPS
http_port = 8000
https_port = 8443

# Set the directory to serve
directory_to_serve = "/volume1/family/Anirudh/Miscellaneous/jcdbmeserver"  # Replace with your directory (use absolute path if necessary)

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            # Serve the custom landing page (index.html)
            self.path = '/index.html'
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
        else:
            # Serve other files as usual
            return super().do_GET()

# Function to start the HTTP server
def start_http_server():
    os.chdir(directory_to_serve)  # Change to the directory you want to serve
    handler = CustomHTTPRequestHandler
    httpd = http.server.HTTPServer(('0.0.0.0', http_port), handler)
    print(f"HTTP server running at http://localhost:{http_port}")
    httpd.serve_forever()

# Function to start the HTTPS server
def start_https_server():
    os.chdir(directory_to_serve)  # Change to the directory you want to serve
    handler = CustomHTTPRequestHandler
    httpsd = http.server.HTTPServer(('0.0.0.0', https_port), handler)

    # Wrap the server socket with SSL (use your own cert and key)
    httpsd.socket = ssl.wrap_socket(httpsd.socket,
                                    keyfile="server.key",  # Path to your private key
                                    certfile="server.crt",  # Path to your certificate
                                    server_side=True)
    print(f"HTTPS server running at https://localhost:{https_port}")
    httpsd.serve_forever()

# Function to start both HTTP and HTTPS servers in separate threads
def start_servers():
    # Start the HTTP server in a new thread
    http_thread = threading.Thread(target=start_http_server)
    http_thread.daemon = True  # Daemonize the thread so it exits when the main program exits
    http_thread.start()

    # Start the HTTPS server in the main thread
    start_https_server()

if __name__ == "__main__":
    start_servers()
