import * as vscode from 'vscode';
import { CodeJudgeProvider } from './providers/CodeJudgeProvider';

import { FetchAllPromptsGateway } from './gateways/FetchAllPromptsGateway';
import { FetchAllPromptsUseCase } from './usecases/FetchAllPromptsUseCase';
import { FetchAllPromptsController } from './controllers/FetchAllPromptsController';

import { ViewPromptGateway } from './gateways/ViewPromptGateway';
import { ViewPromptUseCase } from './usecases/ViewPromptUseCase';
import { ViewPromptController } from './controllers/ViewPromptController';

import { CodeReportGateway } from './gateways/CodeReportGateway';
import { CodeReportUseCase } from './usecases/CodeReportUseCase';
import { CodeReportController } from './controllers/CodeReportController';

import { FileStorageGateway } from './gateways/FileStorageGateway';

export function activate(context: vscode.ExtensionContext) { 
    const viewId = context.extension.packageJSON.contributes.views["codejudge-sidebar"][0].id;
    const currentApiUrl = vscode.workspace.getConfiguration('codejudge').get<string>('apiUrl')!;

    // 1. Camada de Infraestrutura: Cria o gateway que sabe falar com a API
    const fetchAllPromptsGateway = new FetchAllPromptsGateway(currentApiUrl);
    const viewPromptsGateway = new ViewPromptGateway(currentApiUrl);
    const codeReportGateway = new CodeReportGateway(currentApiUrl);
    const fileStorageGateway = new FileStorageGateway();

    // 2. Camada de Domínio: Cria o cérebro (Use Case) injetando o gateway nele
    const fetchAllPromptsUseCase = new FetchAllPromptsUseCase(fetchAllPromptsGateway);
    const viewPromptsUsecase = new ViewPromptUseCase(viewPromptsGateway, fileStorageGateway);
    const codeReportUseCase = new CodeReportUseCase(codeReportGateway, fileStorageGateway);

    // 3. Camada de Apresentação: Cria o Controller injetando o Use Case nele
    const fetchAllPromptsController = new FetchAllPromptsController(fetchAllPromptsUseCase);
    const viewPromptController = new ViewPromptController(viewPromptsUsecase);
    const codeReportController = new CodeReportController(codeReportUseCase, fileStorageGateway);
    
    // Mapa de controllers
    const rotasDoWebview = {
        'fetch-all-prompts': fetchAllPromptsController,
        'view-selected-prompt': viewPromptController,
        'process': codeReportController
        // 'save-code': saveCodeController, etc...
    };

    const provider = new CodeJudgeProvider(context.extensionUri, rotasDoWebview);

    // --- NOVA ALTERAÇÃO: REGISTRO DO COMANDO DE EXPORTAÇÃO DE PDF ---
    // Este comando intercepta o clique do link '[📥 Clique aqui para Exportar...](command:codejudge.exportPDF?...)'
    let exportPdfCommand = vscode.commands.registerCommand('codejudge.exportPDF', async (base64Data: string) => {
        await codeReportController.exportPDF(base64Data);
    });

    // Registra tanto o provedor do Webview da barra lateral quanto o novo comando de PDF
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(viewId, provider),
        exportPdfCommand
    );
}

export function deactivate() { }