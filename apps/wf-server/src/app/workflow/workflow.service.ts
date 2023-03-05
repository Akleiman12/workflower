import { Injectable, NotFoundException } from '@nestjs/common';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Workflow, validateWorkflow, WorkflowCreateDTO, WorkflowUpdateDTO } from '@workflower/wf-shared'
import { Repository } from 'typeorm';
import { WorkflowEntity } from './workflow.entity';

@Injectable()
export class WorkflowService {
    constructor(
        @InjectRepository(WorkflowEntity)
        private workflowRepository: Repository<WorkflowEntity>
      ) { }
    
    async findAll() {
        return this.workflowRepository.find({ where: { deleted: false }});
    }

    async findById(id: number) {
        const workflow = await this.workflowRepository.findOneBy({ id, deleted: false });
        if (!workflow) throw new NotFoundException('Workflow not found');
        return workflow;
    }

    async create(workflowCreate: WorkflowCreateDTO){
        const workflow = this.workflowRepository.create({ ...workflowCreate });
        await validateWorkflow(workflow).catch((e) => {
            throw new BadRequestException(e.message);
        });
        return this.workflowRepository.save(workflow).catch((e: Error) => {
            if (e.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed')) {
                throw new BadRequestException(`Name property has to be unique. Another workflow already has the name "${workflowCreate.name}"`);
            }
            throw new InternalServerErrorException('Unknown error. Try again later');
        });
    }

    async update(id: number, workflowUpdate: WorkflowUpdateDTO) {
        const workflow = await this.workflowRepository.findOneBy({ id });
        if (!workflow) throw new NotFoundException('Workflow to update does not exist');
        return this.workflowRepository.update(id, { ...workflowUpdate }).catch((e: Error) => {
            if (e.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed')) {
                throw new BadRequestException(`Name property has to be unique. Another workflow already has the name "${workflowUpdate.name}"`);
            }
            throw new InternalServerErrorException('Unknown error. Try again later')
        });;
    }

    async delete(id) {
        const workflow = await this.workflowRepository.findOneBy({ id });
        if (!workflow) throw new NotFoundException('Workflow to delete does not exist');
        workflow.deleted = true;
        return this.workflowRepository.update(id, workflow);
    }

}
