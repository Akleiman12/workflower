import { Tooltip } from 'react-tooltip';
import { AiOutlineInfoCircle as InfoIcon } from 'react-icons/ai';
import { FormEvent, ReactElement, useState } from 'react';
import { getFirstAvailableId, WorkflowNode, WorkflowNodeTypeEnum } from '@workflower/wf-shared';

import 'react-tooltip/dist/react-tooltip.css'


export function WorkflowForm(props: { workflowName: string, nodes: Partial<WorkflowNode>[], onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
    const { onSubmit, workflowName } = props;
    const [nodes, setNodes] = useState(props.nodes);

    const tooltipMessage = "Set the IDs of the outgoing nodes, separated by a comma.";

    // Function to create the individual form fields for each of the currently existing nodes
    const getNodeForms = (nodes: Partial<WorkflowNode>[]) => {
        const inputs: ReactElement[] = [];
        for(const [i, node] of nodes.entries()) {
            inputs.push(
                <div key={node.id} className='form-block'>
                    <h4>Node {i + 1}</h4>
                    <label>ID: {node.id}</label>
                    <input name={`node.${node.id}.id`} value={node.id} hidden readOnly/>
                    <label>Outgoing nodes <InfoIcon className="tooltip-icon" data-tooltip-content={tooltipMessage}/></label>
                    <input name={`node.${node.id}.outgoingNodes`} defaultValue={node.outgoingNodes?.join(',')}/>
                    <label>Type:</label>
                    <select required={true} name={`node.${node.id}.type`} defaultValue={node.type} >
                        <option value={undefined}>Select one</option>
                        <option value={WorkflowNodeTypeEnum.INIT}>Init</option>
                        <option value={WorkflowNodeTypeEnum.ACTION}>Action</option>
                        <option value={WorkflowNodeTypeEnum.CONDITIONAL}>Conditional</option>
                        <option value={WorkflowNodeTypeEnum.END}>End</option>
                    </select>
                    <br/>
                    <button className="remove-button" type="button" onClick={() => removeNode(i)}>Remove node</button>
                </div>
            );
        }
        return inputs;
    }

    // Function to add a node at the end of the list
    const addNode = () => {
        const newNode = {
            id: getFirstAvailableId(nodes),
            outgoingNodes: [],
            incomingNodes: [],
            type: undefined
        }
        const newNodesList = nodes.concat(newNode);
        setNodes(newNodesList);
    }

    // Function to remove the selected node from the list
    const removeNode = (i: number) => {
        const newNodesList = nodes.slice();
        newNodesList.splice(i, 1);
        setNodes(newNodesList);
    }

    return(
        <form method="post" onSubmit={onSubmit}>
        <label>Name:</label>
        <input required={true} name="name" type="text" defaultValue={workflowName}/>
        <h3>Nodes:</h3>
        {getNodeForms(nodes)}
        <br/>
        <button className="add-button" type="button" onClick={addNode}>Add Node</button><br/>
        <input className="submit-button" type="submit" value="Submit" />
        <Tooltip anchorSelect=".tooltip-icon" />
    </form>
    )
}