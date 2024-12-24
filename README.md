# MovieServer
This is not a tool that creates a movie server, rather source code for a potential movie server setup. To use this code, you will need:
| Software | Status |
| -------- | ------- |
| Node.js  | **Mandatory**    |
| Python 3 | **Not needed anymore**    |
| Jellyfin/Plex    | **Optional, but recommended for more media UI** |

Any Node.js libraries will be included in the node_modules folder(s)
Installers for the tools will be included.

## Servers
There are 5 servers that will be running on your device, if you include Jellyfin.

The main HTTPS server on port 8080 (Node.js), is a hub that is currently only designed for 2 - 4 movie buttons. You can add more if you want to. Port 8080 in this example does not include every movie.

The server on port 4443 is an HTTPS backup server (Python 3) that has significantly more delay but serves as a backup decently enough.

The HTTP server on port 8000 serves the directory all movies are in, and already supports [HTTP range requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests) in the local copy. Will be pushed to GitHub soon. HTTP range request support allows the browser to request a certain part of the video, allowing you to seek forward and backward. 

The Jellyfin HTTP server on port 8096 (or a Plex HTTP server on port 32400) on the other hand supports HTTP range requests by default, in any configuration, allowing users to seek back and forth, and it uses the same concept of loading chunks of the video at a time and while one is being viewed the other downloads behind the scenes, but it isn't in a unique format, like .ts files for HLS and .m4s files for MPEG-DASH, instead they're regular MP4 files (as long as it doesn't need transcoding, then Jellyfin will use HLS by default), but it is loaded in chunks, using the JavaScript fetch API.

And last but not least, the HTTP server running on port 3000 serves as a chat server built with WebSocket (a socket.io version will come soon enough) where users can chat in a selection of pre-made rooms.
