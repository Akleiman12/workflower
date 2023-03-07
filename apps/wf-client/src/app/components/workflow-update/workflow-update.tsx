import { calculateIncomingNodes, validateWorkflow, WorkflowNode } from "@workflower/wf-shared";
import React, { FormEvent } from "react";
import { useParams } from "react-router-dom";
import { WorkflowService } from "../../services/workflow.service";
import { WorkflowForm } from "../generics/workflow-form";

class WorkflowUpdate extends React.Component<{ workflowId: string | undefined }, { workflowId: string, name: string, nodes: WorkflowNode[], loaded: boolean, error: Error | null }> {
    constructor(props: { workflowId: string | undefined }) {
        super(props);
        this.state = {
            workflowId: props.workflowId || '',
            name: '',
            nodes: [],
            loaded: false,
            error: null,
        };
    }

    async componentDidMount() {
        const workflowData = await WorkflowService.getWorkflowById(this.state.workflowId);
        if (typeof workflowData.nodes === 'string') throw new Error('Malformed workflow. Nodes have to be instances of WorkflowNode');

        console.log(workflowData)

        this.setState({
            name: workflowData.name,
            nodes: workflowData.nodes,
            loaded: true
        });
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
        
        // Setup updated workflow
        const updatedWorkflow = {
            id: parseInt(this.state.workflowId),
            name: formData.get('name') as string,
            nodes: completeNodes
        };
        
        // Validate workflow
        await validateWorkflow(updatedWorkflow).catch((e) => {
            this.setState({ error: e })
        });

        // If there is an error, prevent continuing with creation
        if (!this.state.error) {
            // Create and catch if there is an error
            const created = await WorkflowService.updateWorkflow(updatedWorkflow).catch((e) => {
                this.setState({
                    error: e
                })
            });

            // If there was a successful create, navigate to list view
            if (created) window.location.href = '';
        }
    }

    showFormAfterLoad() {
        if (this.state.loaded) {
            return (<WorkflowForm workflowName={this.state.name} nodes={this.state.nodes} onSubmit={this.submitHandler.bind(this)}/>);
        } else {
            return (<div>LOADING...</div>)
        }
    }


    render() {
        return (
            <>
                <h2>Update Workflow</h2>
                { this.showFormAfterLoad() }
                {/* eslint-disable-next-line react/style-prop-object */}
                <div style={ {color: 'red'} }>
                    {this.state.error?.message}
                </div>
            </>
        )
    }
}

const WorkflowUpdateWrapper = () => {
    const { workflowId } = useParams();
    return <WorkflowUpdate workflowId={workflowId} />;
}

export { WorkflowUpdateWrapper as WorkflowUpdate };