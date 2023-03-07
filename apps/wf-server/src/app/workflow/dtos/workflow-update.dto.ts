import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { WorkflowUpdateDTO as WorkflowUpdateBaseDTO} from "@workflower/wf-shared";


export class WorkflowUpdateDTO implements WorkflowUpdateBaseDTO {
    @IsNumber()
    @IsOptional()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    nodes: string;
}