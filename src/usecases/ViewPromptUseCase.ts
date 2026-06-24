import { ViewPromptUseCaseInterface } from '../interfaces/ViewPrompt/ViewPromptUseCaseInterface';
import { ViewPromptGatewayInterface } from '../interfaces/ViewPrompt/ViewPromptGatewayInterface';
import { FileStorageGatewayInterface } from '../interfaces/FileStorage/FileStorageGatewayInterface'; 

export class ViewPromptUseCase implements ViewPromptUseCaseInterface {
    
    constructor(
        private readonly _gateway: ViewPromptGatewayInterface, 
        private readonly _storageGateway: FileStorageGatewayInterface // Injetado com sucesso
    ) {}

    public async execute(category: string, promptKey: string): Promise<any> {
        // 1. Busca os dados brutos do prompt através do gateway da API
        const promptData = await this._gateway.fetchSinglePrompt(category, promptKey);
        
        // --- SELEÇÃO DO CONTEÚDO CORRETO DO PROMPT ---
        let promptContent = '';
        if (promptData && typeof promptData === 'object' && 'prompt' in promptData) {
            promptContent = (promptData as any).prompt;
        } else if (typeof promptData === 'string') {
            promptContent = promptData;
        } else {
            promptContent = (promptData as any).content || JSON.stringify(promptData, null, 2);
        }
        promptContent = promptContent.trim();
        // ---------------------------------------------
        
        console.log("Controller - Retorno do useCase: ", promptContent);

        // 2. Cria um nome dinâmico para o arquivo baseado na categoria, chave e timestamp
        const agora = new Date();
        const timestamp = agora.toISOString().replace(/[-:.]/g, ""); // Ex: 20260617215000
        
        // Substitui espaços ou caracteres estranhos que possam vir na categoria/chave por underscores
        const safeCategory = category.toLowerCase().replace(/[^a-z0-9]/g, "_");
        const safeKey = promptKey.toLowerCase().replace(/[^a-z0-9]/g, "_");
        
        const fileName = `codejudge_prompt_${safeCategory}_${safeKey}_${timestamp}.md`;

        // 3. Solicita ao gateway de arquivos para gravar o prompt na pasta temporária do Windows
        const temporaryFilePath = this._storageGateway.saveTemporaryMarkdown(fileName, promptContent);

        // 4. Retorna a estrutura idêntica para o Controller gerenciar a exibição lateral
        return {
            filePath: temporaryFilePath,
        };
    }
}