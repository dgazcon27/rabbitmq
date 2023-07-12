#!/bin/bash
LABEL=rabbit
mutagen  sync terminate --label-selector $LABEL

mutagen sync create \
    --label=$LABEL \
    --sync-mode=two-way-resolved \
    --default-file-mode=0644 \
    --default-directory-mode=0755 \
    --symlink-mode=posix-raw \
    ./app docker://$(docker compose ps -q node | awk '{print $1}')/app 
