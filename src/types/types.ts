export interface ServiceDescription {
    service?: string;
    endpoint?: string;
    feature?: string;
    data?: string;
    description?: string;
    version?: number;
    group?: string;
    icon?: string;
    integrations?: IntegrationDescription[]
}

export interface ApplicationDescription {
    application?: string;
    feature?: string;
    data?: string;
    description?: string;
    version?: number;
    group?: string;
    icon?: string;
    integrations?: IntegrationDescription[];
}

export interface DatabaseDescription {
    database?: string;
    description?: string;
    data?: string;
    group?: string;
    icon?: string;
}

export enum EdgeDirection {
    LR = 'LR',
    RL = 'RL',
    TB = 'TB',
    BT = 'BT'
}

export type IntegrationDescription = ServiceDescription & ApplicationDescription & DatabaseDescription & {
    edgeDirection?: EdgeDirection;
    groupEdge?: boolean;
    arrowedEdge?: boolean;
};

export type Integraph = ServiceDescription & ApplicationDescription & DatabaseDescription;

export interface ArchitectureDiagramDescription {
    groups: string[];
    services: Service[];
    connections: string[];
}

export interface Service {
    name: string;
    icon?: string;
    label?: string;
    group?: string;
}

export interface IntegraphBlock {
    startPosition: {
        row: number;
        column: number;
    };
    endPosition: {
        row: number;
        column: number;
    };
    text: string;
}

export interface IntegraphYamlBlock {
    path?: string | Buffer;
    startPosition: {
        row: number;
        column: number;
    };
    endPosition: {
        row: number;
        column: number;
    };
    yaml: any;
}

export type IntegraphFile = {
    path: string;
    integrations: IntegraphYamlBlock[]
    repository?: string;
}