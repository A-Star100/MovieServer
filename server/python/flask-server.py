from flask import Flask, send_from_directory
import os

app = Flask(__name__)

# Route for serving the index.html file
@app.route('/')
def serve_index():
    return send_from_directory(os.getcwd(), '/volume1/family/Anirudh/Misc/jcdbmeserver/index.html')

if __name__ == "__main__":
    # You can adjust host and port as needed.
    app.run(host='0.0.0.0', port=8000, ssl_context=('/volume1/family/Anirudh/Misc/jcdbmeserver/certs/server.crt', '/volume1/family/Anirudh/Misc/jcdbmeserver/certs/server.key'))
