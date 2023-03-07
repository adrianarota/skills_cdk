import { App, Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { OORegion, OOStage } from '../config/pipeline_configuration';
import { OOFormStack } from './oo_form_stack';
import { OOFrontEndStack } from './oo_front_end_stack';

export class OfficeOasisStack extends Stage {
  
  private readonly _props: StageProps;

  private readonly _prefix: string;
  
  private readonly _stage: OOStage;

  private readonly _region: OORegion;

  private readonly _frontEndStack: OOFrontEndStack;

  private readonly _formStack: OOFormStack;
  
  constructor(scope: App, id: string, props: StageProps) {
    super(scope, id, props);

    this._props = props;
    this._stage = OOStage.PROD;
    this._region = OORegion.US_EAST_1;
    this._prefix = `oo-${this._stage}-`;

    this._formStack = new OOFormStack(scope, `${this._prefix}FormStack`, {
      env: { region: this._region },
      prefix: 'FormStack-',
      stage: this._stage,
      region: this._region,
    });

    this._frontEndStack = new OOFrontEndStack(scope, `${this._prefix}FrontEndStack`, {
        env: { region: this._region },
        prefix: 'FrontEndStack-',
        stage: this._stage,
        region: this._region,
    });
  }
}
