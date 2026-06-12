import * as vscode from 'vscode';
import { CodeReportUseCase } from '../usecases/CodeReportUseCase';

export class CodeReportController {
    constructor(private readonly useCase: CodeReportUseCase) { }

    public async handle(payload: any): Promise<any> {

        const defaultResponse = { type: "response-process" };
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showErrorMessage('Nenhum arquivo aberto. Abra a aba do seu código antes de processar.');
            return defaultResponse; 
        }

        const code = editor.document.getText().trim();

        if (!code) {
            vscode.window.showErrorMessage('O arquivo atual está vazio.');
            return defaultResponse; 
        }

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `O servidor está processando a ação selecionada. Esse processo pode levar alguns minutos...`,
            cancellable: false
        }, async () => {
            try {
                // 1. Chama o Use Case que faz o fetch e monta o relatório bruto
                const report = await this.useCase.execute(payload, code);    

                // 2. Passa o relatório pronto para ser exibido visualmente na IDE
                await this.renderReport(report);

            } catch (error) {
                vscode.window.showErrorMessage(`Falha na conexão. O servidor está temporariamente indisponível.`);
            }
        });

        return defaultResponse;
    }

    // Método privado responsável estritamente por interagir com a interface do VS Code
    private async renderReport(report: { content: string; isComplex: boolean; success: boolean }): Promise<void> {
        if (report.isComplex) {
            try {
                const doc = await vscode.workspace.openTextDocument({
                    content: report.content.trim(),
                    language: 'plaintext'
                });
                await vscode.window.showTextDocument(doc, {
                    viewColumn: vscode.ViewColumn.Beside,
                    preserveFocus: true
                });
                vscode.window.showInformationMessage('Processamento concluído com sucesso!');
            } catch (error) {
                vscode.window.showErrorMessage('Falha ao abrir o documento de resultado.');
            }
        } else {
            if (report.success) {
                vscode.window.showInformationMessage(report.content);
            } else {
                vscode.window.showErrorMessage(report.content);
            }
        }
    }
}