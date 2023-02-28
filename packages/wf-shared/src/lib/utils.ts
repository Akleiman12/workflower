import { Workflow, WorkflowNode, WorkflowNodeTypeEnum } from "./models/workflow";

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
    const nodesDict = nodesList.reduce((dict, n) => { 
        dict[n.id] = n
        return dict;
    }, {});
  
    const traverse = (curNode: WorkflowNode, visited = []) => {
        if(!visited.find((n) => n.id === curNode.id)) visited.push(curNode);
        curNode.outgoingNodes.forEach((n: number) => {
            visited = traverse(nodesDict[n], visited);
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
export async function validateWorkflow(workflow: Workflow): Promise<void> {
    const nodesList = typeof workflow.nodes === 'string' ? JSON.parse(workflow.nodes) : workflow.nodes;
    if (!nodesList) throw new Error('Nodes in workflow are not defined.');

    // Only one INIT
    const initNodeList = nodesList.filter((n) => n.type === WorkflowNodeTypeEnum.INIT);
    if (initNodeList.length > 1) throw new Error('Workflow has more than one INIT node.');

    // Only one END
    const endNodeList = nodesList.filter((n) => n.type === WorkflowNodeTypeEnum.END);
    if (endNodeList.length > 1) throw new Error('Workflow has more than one INIT node.');

    // INIT has no incoming links
    const initNode = initNodeList.pop();
    if (initNode.incomingNodes.length) throw new Error('INIT can\'t have incomingNodes.');

    // END has no outgoing links
    const endNode = endNodeList.pop();
    if (endNode.outgoingNodes.length) throw new Error('END can\'t have outgoingNodes.');

    // At least one conditional node
    const conditionalNode = nodesList.find((n) => n.type === WorkflowNodeTypeEnum.CONDITIONAL);
    if (!conditionalNode) throw new Error('Missing at least one CONDITIONAL node.');
    
    // At least one action node
    const actionNode = nodesList.find((n) => n.type === WorkflowNodeTypeEnum.ACTION);
    if (!actionNode) throw new Error('Missing at least one ACTION node.');

    // All nodes connected to init
    const result = isGraphValid(nodesList, initNode);
    if (!result) throw new Error('Graph is invalid. Not all nodes are reachable from init.');
}
  