import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Workflow, WorkflowNode } from './workflow.model';

// Entity defined for sqlite3 table
@Entity()
export class WorkflowEntity implements Workflow {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column('json')
    nodes: WorkflowNode[];

}