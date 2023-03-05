import React from "react";
import { WorkflowService } from "../../services/workflow.service";

export class WorkflowList extends React.Component<object, { workflowsList: Array<any> }> {
    constructor(props: any) {
        super(props);
        this.state = {
            workflowsList: []
        }
    }

    renderList(list: any = []) {
        const renderList = [];
        for(const i of list) {
            renderList.push((<li key={i.name}>{i.name}</li>))
        }
        return renderList;
    }

    async componentDidMount() {
        const list: Array<any> = await WorkflowService.getWorkflows() as any;
        console.log('list', list)
        this.setState({
            workflowsList: list
        })
    }

    render() {
        return (
            <> 
            <h2>Workflows List</h2>
                <ul>
                    { this.renderList(this.state.workflowsList)}
                </ul>
            </>
        )
    }
}