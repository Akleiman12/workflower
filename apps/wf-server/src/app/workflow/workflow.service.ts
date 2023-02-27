import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowEntity } from './workflow.entity';
import { Workflow, WorkflowNodeTypeEnum } from './workflow.model';

@Injectable()
export class WorkflowService {
    constructor(
        @InjectRepository(WorkflowEntity)
        private entityRepository: Repository<WorkflowEntity>
      ) { }
    
    async findAll() {
        return this.entityRepository.find();
    }

    async findById(id: number) {
        return this.entityRepository.findOneBy({ id });
    }

    async create(){
        // ...
    }

    async update(id, updateBody) {
        // ...
    }

    async delete(id) {
        // ...
    }

    /**
     * Validates if:
     *  - Init and end boxes exist and valid
     *  - At least one conditional and one action
     *  - all nodes of workflow are connected to init node
     */
    private async validateWorkflow(workflow: Workflow) {
        const nodesList = workflow.nodes;

        // Only one INIT
        const initNodeList = nodesList.filter((n) => n.type === WorkflowNodeTypeEnum.INIT);
        if (initNodeList.length > 1) throw new Error('Workflow has more than one INIT node');

        // Only one END
        const endNodeList = nodesList.filter((n) => n.type === WorkflowNodeTypeEnum.END);
        if (endNodeList.length > 1) throw new Error('Workflow has more than one INIT node');

        // INIT has no incoming links
        const initNode = initNodeList.pop();
        if (initNode.incomingNodes) throw new Error('INIT can\'t have incomingNodes');

        // END has no outgoing links
        const endNode = endNodeList.pop();
        if (endNode.outgoingNodes) throw new Error('END can\'t have outgoingNodes');

        // At least one conditional node
        const conditionalNode = nodesList.find((n) => n.type === WorkflowNodeTypeEnum.CONDITIONAL);
        if (!conditionalNode) throw new Error('Missing at least one CONDITIONAL node')
        
        // At least one action node
        const actionNode = nodesList.find((n) => n.type === WorkflowNodeTypeEnum.ACTION);
        if (!actionNode) throw new Error('Missing at least one ACTION node')

        // All nodes connected to init
        const nodesDict = nodesList.reduce((dict, n) => dict[n.id] = n, {});



    }


}
