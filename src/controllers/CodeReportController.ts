import * as vscode from 'vscode';
import { CodeReportUseCase } from '../usecases/CodeReportUseCase';
import { FileStorageGatewayInterface } from '../interfaces/FileStorage/FileStorageGatewayInterface';

export class CodeReportController {
    // Injetamos também o gateway de arquivos para o controller ter o poder de chamar a geração do PDFKit
    constructor(
        private readonly useCase: CodeReportUseCase,
        private readonly _storageGateway: FileStorageGatewayInterface
    ) { }

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
    private async renderReport(report: { content: string; filePath: string; isComplex: boolean; success: boolean }): Promise<void> {
        if (report.isComplex && report.filePath) {
            try {
                // Transforma o caminho string do Windows/Linux em uma URI oficial de arquivo do VS Code
                const fileUri = vscode.Uri.file(report.filePath);

                // Força o VS Code a abrir a visualização (Preview) nativa do Markdown na coluna ao lado
                await vscode.commands.executeCommand('markdown.showPreviewToSide', fileUri);
                
                vscode.window.showInformationMessage('Relatório estruturado gerado com sucesso!');
            } catch (error) {
                vscode.window.showErrorMessage('Falha ao abrir a visualização do relatório em Markdown.');
            }
        } else {
            if (report.success) {
                vscode.window.showInformationMessage(report.content);
            } else {
                vscode.window.showErrorMessage(report.content);
            }
        }
    }

    /**
     * Método acionado quando o usuário clica no link markdown "Clique aqui para Exportar"
     * @param base64Content O texto limpo do relatório empacotado em Base64 enviado pelo link
     */
    public async exportPDF(base64Content: string): Promise<void> {
        try {
            // 1. Decodifica o texto do relatório de volta para String normal
            const markdownTextClean = Buffer.from(base64Content, 'base64').toString('utf8');

            // 2. Abre a janela nativa de "Salvar Como" do VS Code para o usuário escolher a pasta e nome
            const saveUri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file('codejudge_relatorio.pdf'),
                filters: {
                    'Adobe PDF Documents': ['pdf']
                },
                title: 'Exportar Relatório CodeJudge para PDF'
            });

            // Se o usuário cancelou a caixinha de diálogo, para por aqui
            if (!saveUri) return;

            // 3. Exibe um progresso rápido na tela enquanto escreve os bytes do PDFKit
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Gerando arquivo PDF...",
                cancellable: false
            }, async () => {
                // Chama o método assíncrono do nosso Gateway especialista em PDF
                await this._storageGateway.exportToPDF(saveUri.fsPath, markdownTextClean);
                vscode.window.showInformationMessage(`PDF exportado com sucesso em: ${saveUri.fsPath}`);
            });

        } catch (error) {
            vscode.window.showErrorMessage('Erro crítico ao converter ou salvar o relatório em PDF.');
        }
    }
}