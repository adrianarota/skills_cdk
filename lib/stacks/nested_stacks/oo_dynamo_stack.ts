import { NestedStack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import { OORegion, OOStage } from '../../config/pipeline_configuration';
import { ApiGateway } from 'aws-cdk-lib/aws-events-targets';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

export interface OODynamoStackProps extends StackProps {
    prefix: string;
    stage: OOStage;
    region: OORegion;
}

export class OODynamoStack extends NestedStack {
    private readonly _props: OODynamoStackProps;
    private readonly _database: Table;

    public constructor(scope: Construct, name: string, props: OODynamoStackProps) {
        super(scope, name, props);
        this._props = props;
        this._database = this.buildDatabase();
    }

    private buildDatabase(): Table {
        return new Table(this, `${this._props.prefix}FormsTable`, {
            tableName: 'Forms',
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
        });
    }

    get database(): Table { return this._database; }
}
