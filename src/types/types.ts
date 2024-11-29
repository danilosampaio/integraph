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
    services: string[];
    connections: string[];
}