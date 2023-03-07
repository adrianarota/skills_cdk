import { Construct } from 'constructs';
import {
    AmazonLinuxCpuType,
    AmazonLinuxGeneration,
    AmazonLinuxImage, Instance, InstanceClass, InstanceSize, InstanceType,
    Peer, Port, SecurityGroup, SubnetType, UserData, Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { EvaluatorConfig, EvaluatorType } from '../../config/evaluator';

export interface EvaluatorProps {
    readonly prefix: string;
    readonly evaluatorType: EvaluatorType;
    readonly config: EvaluatorConfig;
}

export class Evaluator {
    private readonly _props: EvaluatorProps;
    private readonly _vpc: Vpc;
    private readonly _securityGroup: SecurityGroup;
    private readonly _amiImage: AmazonLinuxImage;
    private readonly _iamRole: Role;
    private readonly _instance: Instance;

    public constructor(scope: Construct, props: EvaluatorProps) {
        this._props = props;
        this._amiImage = this.buildAmiImage();
        this._vpc = this.buildVpc(scope);
        this._securityGroup = this.buildSecurityGroup(scope);
        this._iamRole = this.buildIAMRole(scope);
        this._instance = this.buildInstance(scope);
    }

    private buildVpc(scope: Construct): Vpc {
        return new Vpc(scope, `${this._props.prefix}VPC`, {
            natGateways: 0,
            subnetConfiguration: [{
                cidrMask: this._props.config.subnetSize,
                name: 'public',
                subnetType: SubnetType.PUBLIC,
            }],
        });
    }

    private buildSecurityGroup(scope: Construct): SecurityGroup {
        const securityGroup = new SecurityGroup(scope, `${this._props.prefix}SecurityGroup`, {
            vpc: this._vpc,
            description: 'Compiler Security Group allowing inbound connections on port 1997',
            allowAllOutbound: true,
        });
        securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(1997), 'Allow TCP 1997');
        securityGroup.addIngressRule(Peer.anyIpv4(), Port.udp(1997), 'Allow UDP 1997');
        return securityGroup;
    }

    private buildAmiImage(): AmazonLinuxImage {
        return new AmazonLinuxImage({
            generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
            cpuType: AmazonLinuxCpuType.X86_64,
        });
    }

    private buildIAMRole(scope: Construct): Role {
        const role = new Role(scope, `${this._props.prefix}IAM-Role`, {
            assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
        });
        role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));
        return role;
    }

    private buildInstance(scope: Construct): Instance {
        const userDataNginx = UserData.forLinux();
        userDataNginx.addCommands(
            'yum install -y docker',
        );
        return new Instance(scope, `${this._props.prefix}Instance`, {
            vpc: this._vpc,
            instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
            machineImage: this._amiImage,
            securityGroup: this._securityGroup,
            role: this._iamRole,
            userData: userDataNginx,
            userDataCausesReplacement: true,
        });
    }
}
