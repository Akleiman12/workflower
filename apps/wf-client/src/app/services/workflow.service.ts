import { WorkflowCreateDTO, WorkflowNode, WorkflowUpdateDTO } from '@workflower/wf-shared';
import axios from 'axios';

const BASE_URL = process.env.NX_SERVER_URL;
export class WorkflowService {

    static async getWorkflows() {
        return axios.get(BASE_URL + '/workflows').then((res) => res.data);
    }

    static getWorkflowById(id: string | number) {
        if (!id) throw Error('No ID provided to get workflow');
        return axios.get(BASE_URL + '/workflows').then((res) => res.data);

    }

    static createWorkflow(props: {name: string, nodes: WorkflowNode[]}) {
        if (!props.name || !props.nodes) throw new Error('Name and a list of nodes have to be provided to create a workflow');
        
        // Create workflowCreateDTO
        const workflow: WorkflowCreateDTO = {
            name: props.name,
            nodes: JSON.stringify(props.nodes)
        };

        // Send create
        return axios.post(BASE_URL + '/workflows/create', workflow).then((res) => res.data).catch((e) => {
            throw e.response.data;
        });
    }

    static updateWorkflow(props: { id: number, name?: string, nodes?: WorkflowNode[] }) {
        if (!props.name && !props.nodes) throw new Error('Either name or a list of nodes have to be provided to update a workflow');

        // Create workflow UpdateDTO
        const workflow: WorkflowUpdateDTO = {
            name: props.name,
            nodes: JSON.stringify(props.nodes)
        };

        // Send update
        return axios.put(BASE_URL + `/workflows/${props.id}`, workflow).then((res) => res.data).catch((e) => {
            throw e.response.data;
        });
    }

    static deleteWorkflow(id: string | number) {
        if (!id) throw Error('No ID provided to get workflow');
        return axios.delete(BASE_URL + `/workflows/${id}`).then((res) => res.data).catch((e) => {
            throw e.response.data;
        });
    }
}