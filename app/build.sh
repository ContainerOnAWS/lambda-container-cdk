ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get default.region)

echo "ACCOUNT_ID: $ACCOUNT_ID"
echo "REGION: $REGION"
sleep 1

docker build -t lambda-container-cdk .

aws ecr create-repository --repository-name lambda-container-cdk --image-scanning-configuration scanOnPush=true --region $REGION

docker tag lambda-container-cdk:latest ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/lambda-container-cdk:latest

aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

docker push ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/lambda-container-cdk:latest

# docker run -it -p 8080:8080 lambda-container-cdk