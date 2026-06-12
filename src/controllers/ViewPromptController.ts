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
}