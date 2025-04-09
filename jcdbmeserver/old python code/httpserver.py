# httpserver.py (Python 2)
import SimpleHTTPServer
import SocketServer

PORT = 3000

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
httpd = SocketServer.TCPServer(("", PORT), Handler)

print("Serving files at port", PORT)
httpd.serve_forever()
