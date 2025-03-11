#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <KEY> <VALUE>"
    exit 1
fi

KEY="$1"
NEW_VALUE="$2"
ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
    echo "File $ENV_FILE not found!"
    exit 1
fi

if grep -q "^$KEY=" "$ENV_FILE"; then
    sed -i "s/^$KEY=.*/$KEY=$NEW_VALUE/" "$ENV_FILE"
else
    echo "$KEY=$NEW_VALUE" >> "$ENV_FILE"
fi
