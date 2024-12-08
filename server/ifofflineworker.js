function checkServerStatus() {
    fetch('https://192.168.254.137:8080/') // Replace with the actual server URL
        .then(response => {
            if (!response.ok) {
                throw new Error('Server response not OK');
            }
        })
        .catch(() => {
            alert('Server may be down or files on it are inaccessible for now.');
            clearInterval(intervalId); // Stop further checks if the server is down
        });
}

// Set up an interval to check the server status every 3 seconds
let intervalId = setInterval(checkServerStatus, 3000);

// Perform an initial check on page load
checkServerStatus();
