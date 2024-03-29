#!/bin/bash
#
# Sign into ECR, build the image, and push it to ECR with latest tag

# Variables ###################################
REPOSITORY_URI=public.ecr.aws/ajktown/api     #
AWS_REGION="us-east-1" # Fixed for public ECR #
###############################################

echo "👀 Signing into Public ECR ..."
aws ecr-public get-login-password \
  --region $AWS_REGION \
  | docker login \
  --username "AWS" \
  --password-stdin $REPOSITORY_URI

echo "👀 Building the image in local ..."
tag_name="ajktown-api:latest"
docker build -q -t $tag_name . # -q for quiet; Does not print anything to STDOUT
docker tag $tag_name $REPOSITORY_URI:latest

echo "👀 Pushing the image to AWS ECR ..."
docker push $REPOSITORY_URI:latest

echo "👀 Cleaning up ..."
docker rmi $REPOSITORY_URI:latest
