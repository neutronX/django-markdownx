#!/usr/bin/env bash

# Compile the docs.
make clean
make html

# Open in the browser.
URL="build/html/index.html"

echo "Documentations index file: $URL"

[[ -x $BROWSER ]] && exec "$BROWSER" "$URL"
path=$(which xdg-open || which gnome-open || which open) && exec "$path" "$URL"
echo "Couldn't find a browser."