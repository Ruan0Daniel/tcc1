import { ViewPromptUseCaseInterface } from '../interfaces/ViewPrompt/ViewPromptUseCaseInterface';
import { ViewPromptGatewayInterface } from '../interfaces/ViewPrompt/ViewPromptGatewayInterface';

export class ViewPromptUseCase implements ViewPromptUseCaseInterface {
    constructor(private readonly _gateway: ViewPromptGatewayInterface) {}

    public async execute(category: string, promptKey: string): Promise<string> {
        const promptData = await this._gateway.fetchSinglePrompt(category, promptKey);
        
        const promptContent = (promptData as any).content || JSON.stringify(promptData, null, 2);
        
        console.log("Controller - Retorno do useCase: ", promptContent.trim());

        return promptContent.trim();
    }
}