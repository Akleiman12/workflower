import { WorkflowNode } from "./models/workflow";

export function isGraphValid(nodesList: WorkflowNode[], initNode: WorkflowNode) {
    const nodesDict = nodesList.reduce((dict, n) => { 
        dict[n.id] = n
        return dict;
    }, {});
    console.log(nodesDict)
  
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
  