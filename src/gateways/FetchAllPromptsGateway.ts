import { FetchAllPromptsGatewayInterface } from '../interfaces/FetchAllPrompts/FetchAllPromptsGatewayInterface';

export class FetchAllPromptsGateway implements FetchAllPromptsGatewayInterface{
    constructor(private readonly apiUrl: string) {}

    public async fetchAllPrompts(): Promise<any> {
        const response = await fetch(`${this.apiUrl}/prompts/all`, 
        {
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Falha ao comunicar com a aplicação externa');
        }

        return await response.json();
    }
}