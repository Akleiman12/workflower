import { Workflow } from "@workflower/wf-shared";
import React from "react";
import { Link } from "react-router-dom";
import { WorkflowService } from "../../services/workflow.service";
import { WorkflowGrapher } from "../generics/workflow-grapher";
import { HiMagnifyingGlass } from "react-icons/hi2"

/**
 * Component for Workflow List view
 */
export class WorkflowList extends React.Component<object, { workflowsList: Array<Workflow>, selected: Workflow | null }> {
    constructor(props: object) {
        super(props);
        this.state = {
            workflowsList: [],
            selected: null
        }
    }

    renderList(list: Array<Workflow> = []) {
        if(list.length === 0) {
            return (<tr>No workflows yet.</tr>)
        }
        const renderList = [];
        for(const workflow of list) {
            renderList.push((
                <tr key={workflow.name}>
                    <td>{workflow.name}</td>
                    <td className="table-options">
                        <button onClick={() => this.setState({ selected: { ...workflow } })}><HiMagnifyingGlass/></button>
                        <button>
                            <Link to={`/update/${workflow.id}`}>Edit</Link>
                        </button>
                        <button onClick={() => this.deleteWorkflow(workflow.id)}>Delete</button>
                    </td>
                </tr>
            ));
        }
        return renderList;
    }

    async componentDidMount() {
        const list: Array<Workflow> = await WorkflowService.getWorkflows();
        this.setState({
            workflowsList: list
        })
    }

    async deleteWorkflow(id: number) {
        const result = confirm('This action can\'t be undone. Are you sure you want to proceed?');
        if (result) {
            await WorkflowService.deleteWorkflow(id);
            window.location.reload();
        }
    }

    showWorkflowGraph() {
        if(this.state.selected) {
            return (
                <>
                    <h3>Showing workflow: { this.state.selected.name }</h3>
                    <WorkflowGrapher workflow={this.state.selected}></WorkflowGrapher>
                </>
            )
        } else {
            return (
                <h3>Select a workflow to show its graph</h3>
            )
        }
    }

    render() {
        return (
            <> 
            <h2>Workflows List</h2>
                <table className="workflow-table">
                    <thead>
                        <tr>
                            <th>Workflow</th>
                            <th className="table-options">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderList(this.state.workflowsList)}
                    </tbody>
                </table>
                <br/>
                { this.showWorkflowGraph()}
            </>
        )
    }
}