import { FormEvent, Component } from "react";
import { baseGraph, calculateIncomingNodes, validateWorkflow, WorkflowNode } from '@workflower/wf-shared';
import { WorkflowService } from "../../services/workflow.service";
import { WorkflowForm } from "../generics/workflow-form";

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