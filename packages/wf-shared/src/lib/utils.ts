import { Workflow, WorkflowNode, WorkflowNodeTypeEnum } from "./models/workflow";

// Base Nodes Array to start of when creating a new workflow
export const baseGraph: WorkflowNode[] = [
    {
        id: 0,
        incomingNodes: [],
        outgoingNodes: [1],
        type: WorkflowNodeTypeEnum.INIT,
    },
    {
        id: 1,
        incomingNodes: [0],
        outgoingNodes: [2],
        type: WorkflowNodeTypeEnum.CONDITIONAL,
    },
    {
        id: 2,
        incomingNodes: [1],
        outgoingNodes: [3],
        type: WorkflowNodeTypeEnum.ACTION,
    },
    {
        id: 3,
        incomingNodes: [2],
        outgoingNodes: [],
        type: WorkflowNodeTypeEnum.END,
    }
]

/**
 * NOTE:
 * Right now, this function only checks the graph is "traversable" and all nodes are reachable from INIT.
 * But there are several improvements that can be done to increase security:
 * - Check is made only with "outgoingNodes", there is no check using "incomingNodes". This can cause inconsistencies.
 * - Circular graphs are "allowed" by this function, an extra check can be added to prevent the recursivity to pile on until memory fails.
 * 
 * @param nodesList List of all nodes from a graph
 * @param initNode Node of type INIT in the list
 * @returns True if graph is valid, false if graph is invalid
 */
function isGraphValid(nodesList: WorkflowNode[], initNode: WorkflowNode): boolean {
    const nodesDict: Map<number | string, WorkflowNode> = nodesList.reduce((dict, n) => { 
        dict.set(n.id, n);
        return dict;
    }, new Map());
  
    const traverse = (curNode: WorkflowNode | undefined, visited: WorkflowNode[] = []) => {
        if (!curNode) return visited;
        if(!visited.find((n) => n.id === curNode.id)) visited.push(curNode);
        curNode.outgoingNodes.forEach((n: number) => {
            visited = traverse(nodesDict.get(n), visited);
        })
        return visited;
    }
  
    const allVisited = traverse(initNode);
  
    return allVisited.length === nodesList.length;
}

/**
 * Validates if:
 *  - Init and end boxes exist and valid
 *  - At least one conditional and one action
 *  - all nodes of workflow are connected to init node
 * Throws error if workflow is invalid.
 * @param workflow workflow object to be evaluated
 */
export async function validateWorkflow(workflow: Partial<Workflow>): Promise<void> {
    const nodesList = typeof workflow.nodes === 'string' ? JSON.parse(workflow.nodes) : workflow.nodes;
    if (!nodesList) throw new Error('Nodes in workflow are not defined.');

    // Check length of node list
    if (nodesList.length < 4) throw new Error('Workflows are expected to have atleast 4 nodes (INIT, CONDITIONAL, ACTION and END)');

    // Only one INIT
    const initNodeList = nodesList.filter((n: WorkflowNode) => n.type === WorkflowNodeTypeEnum.INIT);
    if (initNodeList.length > 1) throw new Error('Workflow has more than one INIT node.');

    // Only one END
    const endNodeList = nodesList.filter((n: WorkflowNode) => n.type === WorkflowNodeTypeEnum.END);
    if (endNodeList.length > 1) throw new Error('Workflow has more than one INIT node.');

    // INIT has no incoming links
    const initNode = initNodeList.pop();
    if (initNode.incomingNodes.length) throw new Error('INIT can\'t have incomingNodes.');

    // END has no outgoing links
    const endNode = endNodeList.pop();
    if (endNode.outgoingNodes.length) throw new Error('END can\'t have outgoingNodes.');

    // At least one conditional node
    const conditionalNode = nodesList.find((n: WorkflowNode) => n.type === WorkflowNodeTypeEnum.CONDITIONAL);
    if (!conditionalNode) throw new Error('Missing at least one CONDITIONAL node.');
    
    // At least one action node
    const actionNode = nodesList.find((n: WorkflowNode) => n.type === WorkflowNodeTypeEnum.ACTION);
    if (!actionNode) throw new Error('Missing at least one ACTION node.');

    // All nodes connected to init
    const result = isGraphValid(nodesList, initNode);
    if (!result) throw new Error('Graph is invalid. Not all nodes are reachable from init.');
}

export function calculateIncomingNodes(nodes: Partial<WorkflowNode>[]): WorkflowNode[] {
    // Map => id , incomingNodes for the given id
    const incomingNodesDict: Map<number, number[]> = new Map();
    const nodesCopy = nodes.slice();

    // Search outgoingNodes to determine incomingNodes
    nodesCopy.forEach((node) => {
        // Check if id is a number, if it isnt something is wrong with the nodes
        const curNodeId = typeof node.id === 'number' ? node.id : null;
        if (curNodeId === null) throw new Error('A Node id is invalid');

        // Prevent error, if no outgoingNodes are defined assumes its just an empty array
        if (!node.outgoingNodes) node.outgoingNodes = [];

        if (node.type === WorkflowNodeTypeEnum.INIT) incomingNodesDict.set(curNodeId, []);
        
        // Set IncomingNodes in dictionary from outgoingNodes
        node.outgoingNodes.forEach((outgoingNodeId) => {
            const arrayFromMap: number[] = incomingNodesDict.get(outgoingNodeId) || [];
            if (curNodeId !== undefined) arrayFromMap.push(curNodeId);
            incomingNodesDict.set(outgoingNodeId, arrayFromMap);
        })
    })

    // Set incomingNodes to nodesCopy
    nodesCopy.map((node) => {
        if(typeof node.id === 'number') node.incomingNodes = incomingNodesDict.get(node.id) || [];
        return node;
    })

    return nodesCopy as WorkflowNode[];
}

export function getFirstAvailableId(nodes: Partial<WorkflowNode>[]) {
    let availableId = 0;
    const usedIds = nodes.map((node) => node.id);

    while(usedIds.includes(availableId)) {
        availableId++
    }
    return availableId;
}