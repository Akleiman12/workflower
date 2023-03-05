import React from "react";
import { useParams } from "react-router-dom";
import { WorkflowService } from "../../services/workflow.service";

class WorkflowUpdate extends React.Component<{ workflowId: string | undefined }, { workflowId: string, workflowData: any }> {
    constructor(props: { workflowId: string | undefined }) {
        super(props);
        this.state = {
            workflowId: props.workflowId || '',
            workflowData: {}
        };
    }

    async componentDidMount() {
        const workflowData = await WorkflowService.getWorkflowById(this.state.workflowId);
        this.setState({
            workflowData
        });
    }
    render() {
        return (
            <>
                Current ID: { this.state.workflowId }
                <br/>
                DATA: <br/>
                {JSON.stringify(this.state.workflowData)}
            </>
        )
    }
}

const WorkflowUpdateWrapper = () => {
    const { workflowId } = useParams();
    return <WorkflowUpdate workflowId={workflowId} />;
}

export { WorkflowUpdateWrapper as WorkflowUpdate };