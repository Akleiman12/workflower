import { useState, FormEvent, Component, ReactElement } from "react";
import { baseGraph, calculateIncomingNodes, getFirstAvailableId, validateWorkflow, WorkflowNode, WorkflowNodeTypeEnum } from '@workflower/wf-shared';
import { WorkflowService } from "../../services/workflow.service";

function WorkflowForm(props: { workflowName: string, nodes: Partial<WorkflowNode>[], onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
    const { onSubmit } = props;
    const [nodes, setNodes] = useState(props.nodes);

    // Function to create the individual form fields for each of the currently existing nodes
    const getNodeForms = (nodes: Partial<WorkflowNode>[]) => {
        const inputs: ReactElement[] = [];
        for(const [i, node] of nodes.entries()) {
            inputs.push(
                <div key={node.id}>
                    <h4>Node {i + 1}</h4>
                    <label>ID: {node.id}<input name={`node.${node.id}.id`} value={node.id} hidden readOnly/></label><br/>
                    <label>
                        Outgoing nodes
                        <input name={`node.${node.id}.outgoingNodes`} defaultValue={node.outgoingNodes?.join(',')}/><br/>
                    </label>
                    <label>
                        Type:
                        <select required={true} name={`node.${node.id}.type`} defaultValue={node.type} >
                            <option value={undefined}>Select one</option>
                            <option value={WorkflowNodeTypeEnum.INIT}>Init</option>
                            <option value={WorkflowNodeTypeEnum.ACTION}>Action</option>
                            <option value={WorkflowNodeTypeEnum.CONDITIONAL}>Conditional</option>
                            <option value={WorkflowNodeTypeEnum.END}>End</option>
                        </select><br/>
                    </label>
                    <button type="button" onClick={() => removeNode(i)}>Remove node</button>
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
        <label>
            Name:
            <input required={true} name="name" type="text" />
        </label>
        <br/>
        <div>
            <h3>Nodes:</h3>
            { /* Start of nodes form, later to be abstracted */}
            <div className="nodeForm">
                {getNodeForms(nodes)}
                <br/>
                <button type="button" onClick={addNode}>Add Node</button>
            </div>
        </div>
        <br/>
        <input type="submit" value="Submit" />
    </form>
    )
}

export class WorkflowCreate extends Component<object, { name: string, nodes: WorkflowNode[], error: null | Error }> {
    constructor(props: object) {
        super(props);
        this.state = {
            name: '',
            nodes: baseGraph.slice(),
            error: null
        }
    }

    async submitHandler(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Reset error state
        this.setState({
            error: null
        });

        // Get form data
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        // Fill list of nodes with form data
        const newNodes: Partial<WorkflowNode>[] = [];
        formData.forEach((val, key) => {
            if (typeof val !== 'string') return;
            if (key !== 'name') {
                const nodeKeys = key.split('.');
                const index = parseInt(nodeKeys[1]);
                const propName = nodeKeys[2];

                if (!newNodes[index]) newNodes[index] = {};

                if (propName === 'type' || propName === 'id') {
                    newNodes[index][propName] = parseInt(val);
                } else if (propName === 'outgoingNodes') {
                    newNodes[index].outgoingNodes = val.split(',').map((n) => parseInt(n)).filter(Number);
                }
            }
        });
        
        // Calculate incomingNodes properties
        const completeNodes = calculateIncomingNodes(newNodes);
        
        // Setup new workflow
        const newWorkflow = {
            name: formData.get('name') as string,
            nodes: completeNodes
        };
        
        // Validate workflow
        await validateWorkflow(newWorkflow).catch((e) => {
            this.setState({ error: e })
        });

        // If there is an error, prevent continuing with creation
        if (!this.state.error) {
            // Create and catch if there is an error
            const created = await WorkflowService.createWorkflow(newWorkflow).catch((e) => {
                this.setState({
                    error: e
                })
            });

            // If there was a successful create, navigate to list view
            if (created) window.location.href = '';
        }
    }

    render() {
        return (
            <>
                <h2>Create a Workflow</h2>
                <WorkflowForm workflowName={this.state.name} nodes={this.state.nodes} onSubmit={this.submitHandler.bind(this)}/>
                {/* eslint-disable-next-line react/style-prop-object */}
                <div style={ {color: 'red'} }>
                    {this.state.error?.message}
                </div>
            </>
        )
    }
}