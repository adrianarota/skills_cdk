import { App, Stack, StackProps } from 'aws-cdk-lib';
import { OORegion, OOStage } from '../config/pipeline_configuration';

export interface OOFrontEndStackProps extends StackProps {
    prefix: string;
    stage: OOStage;
    region: OORegion;
}

export class OOFrontEndStack extends Stack {
    private readonly _props: OOFrontEndStackProps;
    // private readonly _internalEvaluator: Evaluator;

    constructor(scope: App, id: string, props: OOFrontEndStackProps) {
        super(scope, id, props);
        this._props = props;

        // this._internalEvaluator = this.buildEvaluator(EvaluatorType.INTERNAL);// this._landingEvaluator = this.buildEvaluator(EvaluatorType.LANDING);
    }

    /*private buildEvaluator(type: EvaluatorType): Evaluator {
        return new Evaluator(this, {
            prefix: `${this._props.prefix}${type}-`,
            evaluatorType: type,
            config: EVALUATOR_MAPPING.getConfig(this._props.stage, this._props.region),
        });
    }

    get internalEvaluator(): Evaluator { return this._internalEvaluator; }*/
}
