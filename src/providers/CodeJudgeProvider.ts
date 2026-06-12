import * as vscode from 'vscode';
import { createWebviewHtml } from '../webview/Webview';

export class CodeJudgeProvider implements vscode.WebviewViewProvider {

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _routes: Record<string, any>
    ) { }

    public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken): void {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = createWebviewHtml(this._extensionUri);

        // Roteamento inteligente e genérico
        webviewView.webview.onDidReceiveMessage(async (data) => {
            const { type, payload } = data;

            const controller = this._routes[type];

            if (controller) {
                // Executa o handle do controller (independente de qual seja)
                const result = await controller.handle(payload);

                // Se o controller retornar algum dado, devolve para a Webview
                if (result && typeof result.type === 'string' && result.type.trim() !== '') {

                    webviewView.webview.postMessage({
                        type: result.type,
                        payload: result.payload ?? {}
                    });
                }
            } else {
                console.warn(`Nenhum controller encontrado para o comando: ${type}`);
            }
        });
    }
}