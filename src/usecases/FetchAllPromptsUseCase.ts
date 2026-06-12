import { FetchAllPromptsUseCaseInterface } from '../interfaces/FetchAllPrompts/FetchAllPromptsUseCaseInterface';
import { FetchAllPromptsGatewayInterface } from '../interfaces/FetchAllPrompts/FetchAllPromptsGatewayInterface';

export class FetchAllPromptsUseCase implements FetchAllPromptsUseCaseInterface {
    
    constructor(private readonly gateway: FetchAllPromptsGatewayInterface) { }

    public async execute(): Promise<any> {
        try {

            const result = await this.gateway.fetchAllPrompts();

            return result;
        } catch (error) {
            throw new Error('Erro ao processar a busca de prompts');
        }
    }
}