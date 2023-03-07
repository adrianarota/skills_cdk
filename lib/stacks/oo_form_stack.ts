import { App, Stack, StackProps } from 'aws-cdk-lib';
import { OORegion, OOStage } from '../config/pipeline_configuration';
import { OOApiGatewayStack } from './nested_stacks/oo_api_gateway_stack';
import { OODynamoStack } from './nested_stacks/oo_dynamo_stack';
import { OOFormInputLambdaStack } from './nested_stacks/oo_lambda_stack';

export interface OOFormStackProps extends StackProps {
    prefix: string;
    stage: OOStage;
    region: OORegion;
}

export class OOFormStack extends Stack {
    private readonly _props: OOFormStackProps;
    private readonly _ooGatewayStack: OOApiGatewayStack;
    private readonly _ooDynamoStack: OODynamoStack;
    private readonly _ooFormInputLambdaStack: OOFormInputLambdaStack;

    constructor(scope: App, id: string, props: OOFormStackProps) {
        super(scope, id, props);
        this._props = props;

        this._ooDynamoStack = this.buildDatabase();
        this._ooGatewayStack = this.buildApiGateway();
        this._ooFormInputLambdaStack = this.buildLambda();
    }

    private buildDatabase(): OODynamoStack {
        return new OODynamoStack(this, `${this._props.prefix}Dynamo`, {
            prefix: `${this._props.prefix}Dynamo-`,
            region: this._props.region,
            stage: this._props.stage,
        });
    }

    private buildApiGateway(): OOApiGatewayStack {
        return new OOApiGatewayStack(this, `${this._props.prefix}Gateway`, {
            prefix: `${this._props.prefix}Gateway-`,
            region: this._props.region,
            stage: this._props.stage,
        });
    }

    private buildLambda(): OOFormInputLambdaStack {
        return new OOFormInputLambdaStack(this, `${this._props.prefix}Lambda`, {
            prefix: `${this._props.prefix}Lambda-`,
            region: this._props.region,
            stage: this._props.stage,
            ooApiGateway: this._ooGatewayStack,
        });
    }

    get dynamoDb(): OODynamoStack { return this._ooDynamoStack; }
    get apiGateway(): OOApiGatewayStack { return this._ooGatewayStack; }
    get lambda(): OOFormInputLambdaStack { return this._ooFormInputLambdaStack; }
}
