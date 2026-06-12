import * as vscode from 'vscode';
import { FetchAllPromptsUseCaseInterface } from '../interfaces/FetchAllPrompts/FetchAllPromptsUseCaseInterface';

export class FetchAllPromptsController {
    constructor(private readonly useCase: FetchAllPromptsUseCaseInterface) {}

    public async handle(_payload: any): Promise<any> {
        const result = await this.useCase.execute();

        if (result instanceof Error) {
            vscode.window.showErrorMessage(result.message);
            return null;
        }

        return { 
            type: "response-fetch-all-prompts", 
            payload: result
        };
    }
}