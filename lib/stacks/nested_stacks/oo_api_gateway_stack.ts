import { NestedStack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { OORegion, OOStage } from '../../config/pipeline_configuration';
import { LambdaRestApi, RestApi } from 'aws-cdk-lib/aws-apigateway';

export interface OOApiGatewayStackProps extends StackProps {
    prefix: string;
    stage: OOStage;
    region: OORegion;
}

export class OOApiGatewayStack extends NestedStack {
    private readonly _props: OOApiGatewayStackProps;
    private readonly _restApi: RestApi;

    public constructor(scope: Construct, name: string, props: OOApiGatewayStackProps) {
        super(scope, name, props);
        this._props = props;
        this._restApi = this.buildRestApi();
    }

    private buildRestApi(): RestApi {
        return new RestApi(this, `${this._props.prefix}RestAPI`, {
            description: 'This API processes responses from user forms',
            deployOptions: {
              stageName: this._props.stage,
            },
            defaultCorsPreflightOptions: {
              allowHeaders: [
                'Content-Type',
                'X-Amz-Date',
                'Authorization',
                'X-Api-Key',
              ],
              allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
              allowCredentials: true,
              allowOrigins: ['http://localhost:3000'],
            },
          }
        );
    }

    get restApi(): RestApi { return this._restApi; }
}
