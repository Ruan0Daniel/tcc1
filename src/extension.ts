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

export function activate(context: vscode.ExtensionContext) { 
    const viewId = context.extension.packageJSON.contributes.views["codejudge-sidebar"][0].id;
    const currentApiUrl = vscode.workspace.getConfiguration('codejudge').get<string>('apiUrl')!;

    // 1. Camada de Infraestrutura: Cria o gateway que sabe falar com a API
    const fetchAllPromptsGateway = new FetchAllPromptsGateway(currentApiUrl);
    const viewPromptsGateway = new ViewPromptGateway(currentApiUrl);
    const codeReportGateway = new CodeReportGateway(currentApiUrl);

    // 2. Camada de Domínio: Cria o cérebro (Use Case) injetando o gateway nele
    const fetchAllPromptsUseCase = new FetchAllPromptsUseCase(fetchAllPromptsGateway);
    const viewPromptsUsecase = new ViewPromptUseCase(viewPromptsGateway);
    const codeReportUseCase = new CodeReportUseCase(codeReportGateway);

    // 3. Camada de Apresentação: Cria o Controller injetando o Use Case nele
    const fetchAllPromptsController = new FetchAllPromptsController(fetchAllPromptsUseCase);
    const viewPromptController = new ViewPromptController(viewPromptsUsecase);
    const codeReportController = new CodeReportController(codeReportUseCase);
    
    // Mapa de controllers
    const rotasDoWebview = {
        'fetch-all-prompts': fetchAllPromptsController,
        'view-selected-prompt': viewPromptController,
        'process': codeReportController
        // 'save-code': saveCodeController, etc...
    };

    const provider = new CodeJudgeProvider(context.extensionUri, rotasDoWebview);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(viewId, provider)
    );
}

export function deactivate() { }