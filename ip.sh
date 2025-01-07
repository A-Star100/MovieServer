#!/bin/bash

# Define the directory, the old IP address, and the backups directory
DIRECTORY="$HOME/MovieServer"
BACKUP_DIR="$DIRECTORY/backups"
OLD_IP="192.168.254.137"

# Ask the user for the new IP address
read -p "Enter the new IP address: " NEW_IP

# Check if the directory exists
if [ ! -d "$DIRECTORY" ]; then
    echo "Directory $DIRECTORY does not exist. Please install MovieServer using the MovieServer installer at https://github.com/A-Star100/MovieServer/releases/latest and then execute this script again."
    exit 1
fi

# Create the backups directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Replace all occurrences of the old IP with the new IP and store backups in the backups directory
echo "Updating all occurrences of $OLD_IP to $NEW_IP in $DIRECTORY..."
for file in $(grep -rl "$OLD_IP" "$DIRECTORY"); do
    # Copy the original file to the backups directory
    cp "$file" "$BACKUP_DIR/$(basename "$file").bak"
    # Replace the old IP with the new IP
    sed -i "s/$OLD_IP/$NEW_IP/g" "$file"
done

echo "Update completed! Backup files are stored in $BACKUP_DIR."
