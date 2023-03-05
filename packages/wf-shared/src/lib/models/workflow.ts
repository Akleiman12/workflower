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
    constructor(props: WorkflowNode) {
        this.id = props.id;
        this.incomingNodes = props.incomingNodes;
        this.outgoingNodes = props.outgoingNodes;
        this.type = props.type;
    }
}

export class Workflow {
    id: number;
    name: string;
    nodes: WorkflowNode[] | string;
    constructor(props: Workflow) {
        this.id = props.id;
        this.name = props.name;
        this.nodes = props.nodes;
    }
}