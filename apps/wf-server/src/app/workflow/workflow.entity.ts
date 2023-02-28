import { Workflow } from '@workflower/wf-shared';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Entity defined for sqlite3 table
@Entity()
export class WorkflowEntity implements Workflow {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    nodes: string;

    @Column('boolean', { default: false })
    deleted: boolean
}