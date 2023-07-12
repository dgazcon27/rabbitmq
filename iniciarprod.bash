#!/bin/bash
DOCKERCOMMAND="docker compose -f docker-compose.yml -f docker-compose-prod.yml"
$DOCKERCOMMAND build 
$DOCKERCOMMAND up -d