import { IsNotEmpty, IsString } from "class-validator";
import { WorkflowCreateDTO as WorkflowCreateBaseDTO } from "@workflower/wf-shared";


export class WorkflowCreateDTO implements WorkflowCreateBaseDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    nodes: string;

    
}