export enum WorkflowNodeTypeEnum {
    INIT,
    END,
    CONDITIONAL,
    ACTION
}

export class WorkflowNode {
    id: number;
    incomingNodes: number[];
    outgoingNodes: number[];
    type: WorkflowNodeTypeEnum;
}

export class Workflow {
    id: number;
    name: string;
    nodes: WorkflowNode[] | string;
}