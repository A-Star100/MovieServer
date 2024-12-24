# MovieServer
This is not a tool that creates a movie server, rather source code for a potential movie server setup. To use this code, you will need:
| Software | Status |
| -------- | ------- |
| Node.js & npx  | **Mandatory**    |
| Jellyfin/Plex    | **Optional** |

Any Node.js libraries will be included in the node_modules folder(s)
Installers for the tools will be included.

## Servers
There are 5 servers that will be running on your device, if you include Jellyfin.

The main HTTPS server on port 8080 (Node.js), is a hub that is currently only designed for 2 - 4 movie buttons. You can add more if you want to. Port 8080 in this example does not include every movie.

The server on port 4443 is an HTTP (npx) backup server that runs very fast, but it takes longer to initialize compared to the main HTTPS server, but after initialization, there isn't much difference.

The HTTP server on port 8000 serves the directory all movies are in, and now supports [HTTP range requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests). HTTP range requests allow the browser to request a certain part of the video, allowing you to seek forward and backward. 

The Jellyfin HTTP server on port 8096 (or a Plex HTTP server on port 32400) on the other hand supports HTTP range requests by default, in any configuration, allowing users to seek back and forth, and it uses the same concept of loading chunks of the video at a time and while one is being viewed the other downloads behind the scenes, but it isn't in a unique format, like .ts files for HLS and .m4s files for MPEG-DASH, instead they're regular MP4 files (as long as it doesn't need transcoding, then Jellyfin will use HLS by default), but it is loaded in chunks, using the JavaScript fetch API.

And last but not least, the HTTP server running on port 3000 serves as a chat server built with plain WebSockets where users can chat in a selection of pre-made rooms.

## Docker (BETA)
A *dockerfile* is available for those who would rather use a Docker container to start the servers. This is viable especially if you're willing to experiment with tasks that could cause problems if running outside of a sandboxed Docker container.

First, install [Docker](https://docker.com), then use Git to clone the repository like this in Terminal:

`git clone https://github.com/A-Star100/MovieServer.git`.

This will copy all contents of *just* the source code into a directory. The dockerfile already installs dependencies. Then type this in Terminal:

`docker build -t movieserver-image .` 

This will build a usable Docker image from the dockerfile

then edit the installed version of the *server.js* file and remove or add proper file paths for any SSL certificates, and then type in:

`docker run -d \
  -p 8080:8080 \
  -p 8000:8000 \
  -p 4443:4443 \
  -p 3000:3000 \
  --name movieserver-container \
  movieserver-image`

This will expose needed ports and run the Docker image you created using a Docker container.

To start or stop the container dynamically, type in:

`docker start movieserver-container`
`docker stop movieserver-container`

Enjoy using Docker!

*NOTE: The dockerfile does not include Jellyfin Media Server or its service, you will have to start it on your device locally or modify the dockerfile if you want to*.

## NAS-specific instructions
NAS devices aren't as flexible as computers when it comes to installing tools. For example, on a Synology NAS using SSH, you will have to use some commands using sudo (even as admin).
For example, instead of 

`npm install DEPENDENCY` or `npm install -g DEPENDENCY`, you need to use sudo, otherwise your NAS will return an error of not being able to write to the directory /var/services/HOME/user, which is only granted if you use sudo, like this

`sudo npm install DEPENDENCY` or `sudo npm install -g DEPENDENCY` (you will need your password for npm installations, but not for npx HTTP servers).
