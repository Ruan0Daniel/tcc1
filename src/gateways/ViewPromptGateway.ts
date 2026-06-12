import { ViewPromptGatewayInterface } from '../interfaces/ViewPrompt/ViewPromptGatewayInterface';

export class ViewPromptGateway implements ViewPromptGatewayInterface {
    constructor(private readonly _apiUrl: string) {}

    public async fetchSinglePrompt(category: string, promptKey: string): Promise<any> {
        const response = await fetch(`${this._apiUrl}/prompts/single/${category}/${promptKey}`, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Prompt não encontrado');
        }

        return await response.json();
    }
}