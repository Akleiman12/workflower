import { Workflow } from "@workflower/wf-shared";
import React from "react";
import { Link } from "react-router-dom";
import { WorkflowService } from "../../services/workflow.service";

export class WorkflowList extends React.Component<object, { workflowsList: Array<Workflow> }> {
    constructor(props: object) {
        super(props);
        this.state = {
            workflowsList: []
        }
    }

    renderList(list: Array<Workflow> = []) {
        const renderList = [];
        for(const node of list) {
            renderList.push((
                <tr key={node.name}>
                    <td>{node.name}</td>
                    <td><button><Link to={`/update/${node.id}`}>Edit</Link></button><button onClick={() => this.deleteWorkflow(node.id)}>Delete</button></td>
                </tr>
            ));
        }
        return renderList;
    }

    async componentDidMount() {
        const list: Array<Workflow> = await WorkflowService.getWorkflows();
        console.log('list', list)
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

    render() {
        return (
            <> 
            <h2>Workflows List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Workflow</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderList(this.state.workflowsList)}
                    </tbody>
                </table>
            </>
        )
    }
}