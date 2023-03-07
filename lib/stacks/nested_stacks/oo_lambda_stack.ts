import { NestedStack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { OORegion, OOStage } from '../../config/pipeline_configuration';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { OOApiGatewayStack } from './oo_api_gateway_stack';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import path = require('path');
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

export interface OOFormInputLambdaStackProps extends StackProps {
    prefix: string;
    stage: OOStage;
    region: OORegion;
    ooApiGateway: OOApiGatewayStack;
}

export class OOFormInputLambdaStack extends NestedStack {
    private readonly _props: OOFormInputLambdaStackProps;
    private readonly _lambda: Function;

    public constructor(scope: Construct, name: string, props: OOFormInputLambdaStackProps) {
        super(scope, name, props);
        this._props = props;
        this._lambda = this.buildFormInputFunction();
        
        const formsResource = this._props.ooApiGateway.restApi.root.addResource('forms');
        formsResource.addMethod(
            'POST',
            new LambdaIntegration(
                this._lambda, 
                {proxy: true},
            ),
        );

    }

    private buildFormInputFunction(): Function {
        return new Function(this, `${this._props.prefix}FormsInput`, {
            functionName: `${this._props.prefix.toLocaleLowerCase()}FormsInput`,
            runtime: Runtime.NODEJS_18_X,
            handler: 'index.main',
            code: Code.fromAsset(path.join(__dirname, '../../../assets/form_input')),
        });
    }

    get lambda(): Function { return this._lambda; }
}
