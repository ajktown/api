#!/bin/bash
#
# Pushes .env to the s3 bucket, with new line env="prod"
# Requires .env file to be present

env_data=$(cat .env) # Get current env
prod_env_data="$env_data"$'\n'"ENV=prod" # Insert new line env="prod" to the end of the file

# Save the new env to a temp file
tmp_file=$(mktemp)
echo "$prod_env_data" > "$tmp_file"

# Copy the file into the s3
aws s3 cp "$tmp_file" "s3://ajktown-s3-bucket/env/prod-api.env"

# Clean up
rm "$tmp_file"