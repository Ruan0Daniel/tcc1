import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function createWebviewHtml(extensionUri: vscode.Uri): string {
    try {
        const webviewFolder = path.join(extensionUri.fsPath, 'src', 'webview');

        let html = fs.readFileSync(path.join(webviewFolder, 'index.html'), 'utf8');
        const css = fs.readFileSync(path.join(webviewFolder, 'style.css'), 'utf8');
        let js = fs.readFileSync(path.join(webviewFolder, 'script.js'), 'utf8');

        // Costura as três partes em uma string HTML única
        html = html.replace('/* {{STYLE_PLACEHOLDER}} */', css);
        html = html.replace('// {{SCRIPT_PLACEHOLDER}}', js);

        return html;

    } catch (error) {
        console.error('Erro ao compilar os arquivos da Webview:', error);
        return `<h3>Erro ao carregar a interface da extensão.</h3>`;
    }
}