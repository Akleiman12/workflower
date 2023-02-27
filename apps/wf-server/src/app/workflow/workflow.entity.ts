import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Workflow, WorkflowNode } from './workflow.model';

@Entity()
export class WorkflowEntity implements Workflow {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column('json')
    nodes: WorkflowNode[];

}