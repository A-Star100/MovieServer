import http.server
import ssl

# Set the port to whatever you want, e.g., 4443 for HTTPS
port = 4443

# Set the directory to serve
directory_to_serve = "/path/to/your/directory"  # Replace with your directory

# Create an HTTP server instance
handler = http.server.SimpleHTTPRequestHandler
httpd = http.server.HTTPServer(('0.0.0.0', port), handler)

# Wrap the HTTP server with SSL to make it HTTPS
httpd.socket = ssl.wrap_socket(httpd.socket,
                               keyfile="server.key",  # Path to your private key
                               certfile="server.crt",  # Path to your SSL certificate
                               server_side=True)

print(f"Serving HTTPS on port {port}")
httpd.serve_forever()
