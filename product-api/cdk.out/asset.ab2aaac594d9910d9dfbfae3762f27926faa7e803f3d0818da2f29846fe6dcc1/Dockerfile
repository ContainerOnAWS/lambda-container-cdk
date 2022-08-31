FROM public.ecr.aws/lambda/nodejs:16

COPY *.js package.json package-lock.json ${LAMBDA_TASK_ROOT}/

RUN npm install