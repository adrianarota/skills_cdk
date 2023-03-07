#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { OOAWSAccount, OORegion } from './config/pipeline_configuration';
import { OfficeOasisStack } from './stacks/oo_stack';

const app = new cdk.App();
new OfficeOasisStack(app, 'OfficeOasisStack', {
    env: { 
        account:OOAWSAccount.PROD, 
        region: OORegion.US_EAST_1,
    },
});
