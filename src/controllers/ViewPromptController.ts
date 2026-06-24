import * as vscode from 'vscode';
import { ViewPromptUseCaseInterface } from '../interfaces/ViewPrompt/ViewPromptUseCaseInterface';

export class ViewPromptController {
    constructor(private readonly _useCase: ViewPromptUseCaseInterface) {}

    public async handle(payload: any): Promise<void> {
        const { category, promptKey } = payload;

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Abrindo prompt...`,
            cancellable: false
        }, async () => {
            try {
                // 1. O Use Case processa, salva o arquivo temporário e retorna o objeto contendo o filePath
                const result = await this._useCase.execute(category, promptKey);
                console.log("Controller - Caminho do arquivo recebido: ", result.filePath);

                if (!result || !result.filePath) {
                    throw new Error("Caminho do arquivo temporário não foi gerado.");
                }

                // 2. Transforma a string do caminho físico em uma URI de arquivo válida para o VS Code
                const fileUri = vscode.Uri.file(result.filePath);

                // 3. Executa o comando nativo do VS Code para abrir o Preview do Markdown na coluna ao lado
                await vscode.commands.executeCommand('markdown.showPreviewToSide', fileUri);

            } catch (error) {
                vscode.window.showErrorMessage(`Não foi possível carregar o prompt selecionado.`);
            }
        });
    }
}










/*import * as vscode from 'vscode';
import { ViewPromptUseCaseInterface } from '../interfaces/ViewPrompt/ViewPromptUseCaseInterface';

export class ViewPromptController {
    constructor(private readonly _useCase: ViewPromptUseCaseInterface) {}

    public async handle(payload: any): Promise<void> {
        const { category, promptKey } = payload;

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Abrindo prompt...`,
            cancellable: false
        }, async () => {
            try {
                const promptContent = await this._useCase.execute(category, promptKey);
                console.log("Controller - Retorno do useCase: ", promptContent);

                const doc = await vscode.workspace.openTextDocument({
                    content: promptContent,
                    language: 'markdown'
                });

                await vscode.window.showTextDocument(doc, {
                    viewColumn: vscode.ViewColumn.Beside,
                    preserveFocus: true
                });

            } catch (error) {
                vscode.window.showErrorMessage(`Não foi possível carregar o prompt selecionado.`);
            }
        });
    }
}*/