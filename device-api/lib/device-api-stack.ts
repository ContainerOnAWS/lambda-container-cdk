import { Stack } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

import { SSM_PREFIX, StackCommonProps } from '../config';

/**
 * /device/v1/{deviceid}
 * /device/v2/{deviceid}
 */
export class DeviceApiStack extends Stack {
  constructor(scope: Construct, id: string, props: StackCommonProps) {
    super(scope, id, props);

    const restApiId = ssm.StringParameter.valueForStringParameter(this, `${SSM_PREFIX}/rest-api-id`); 
    const rootResourceId = ssm.StringParameter.valueForStringParameter(this, `${SSM_PREFIX}/root-resource-id`); 
    const rootApi = apigateway.RestApi.fromRestApiAttributes(this, "root-api", { restApiId, rootResourceId });

    const pingApiFunction = new lambda.DockerImageFunction(this, 'lambda-ping', {
      functionName: 'device-api',
      code: lambda.DockerImageCode.fromImageAsset('../app', {
        cmd: ["hello.handler"],
        entrypoint: ["/lambda-entrypoint.sh"],
      })
    });
    const servicea = rootApi.root.addResource('device');
    servicea.addResource('v1').addResource('{deviceid}').addMethod('GET', new apigateway.LambdaIntegration(pingApiFunction, { proxy: true }));
    servicea.addResource('v2').addResource('{deviceid}').addMethod('GET', new apigateway.LambdaIntegration(pingApiFunction, { proxy: true }));
  }
}
