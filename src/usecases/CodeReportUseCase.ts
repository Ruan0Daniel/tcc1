import { CodeReportGatewayInterface } from '../interfaces/CodeReport/CodeReportGatewayInterface';
import { CodeReportUseCaseInterface } from '../interfaces/CodeReport/CodeReportUseCaseInterface';
import { FileStorageGatewayInterface } from '../interfaces/FileStorage/FileStorageGatewayInterface'; // <-- IMPORTANTE: Ajuste o path se necessário

export class CodeReportUseCase implements CodeReportUseCaseInterface {

    // Ajustado para receber também o Gateway de Arquivos
    constructor(
        private readonly _gateway: CodeReportGatewayInterface,
        private readonly _storageGateway: FileStorageGatewayInterface // <-- Injeção do novo gateway
    ) { }

    public async execute(payload: any, code: string): Promise<any> {

        const statement = payload.statement || "";
        const language = payload.language;
        let result: any;

        switch (payload.action) {
            case 'execute':
                const tests = payload.tests || [];
                result = await this._gateway.executeTests(statement, language, code, tests);
                break;
            case 'compile':
                result = await this._gateway.compile(statement, language, code);
                break;
            case 'analysis':
                result = await this._gateway.analyze(statement, language, code);
                break;
            case 'optimize':
                result = await this._gateway.optimize(statement, language, code);
                break;
            default:
                throw new Error('Ação inválida.');
        }

        console.log("=== [DEBUG] RETORNO BRUTO DO GATEWAY ===");
        console.log(JSON.stringify(result, null, 2));

        const fixEncoding = (objectToFix: any): any => {
            if (typeof objectToFix === 'string') {
                try {
                    return decodeURIComponent(escape(objectToFix));
                } catch {
                    return objectToFix;
                }
            }
            if (Array.isArray(objectToFix)) {
                return objectToFix.map(fixEncoding);
            }
            if (objectToFix !== null && typeof objectToFix === 'object') {
                const cleanedObject: any = {};
                for (const key of Object.keys(objectToFix)) {
                    cleanedObject[key] = fixEncoding(objectToFix[key]);
                }
                return cleanedObject;
            }
            return objectToFix;
        };

        const cleanResult = fixEncoding(result);
        let isComplex = false;
        let content = '';

        if (cleanResult.success === false) {
            content = cleanResult.message || 'Falha na operação.';
            if (content.length > 250) { isComplex = true; }
        } else if (payload.action === 'execute') {
            if (cleanResult.outputs && Array.isArray(cleanResult.outputs) && cleanResult.outputs.length > 0) {
                isComplex = true;
                const isDetailed = typeof cleanResult.outputs[0] === 'object' && ('actual' in cleanResult.outputs[0]);

                if (isDetailed) {
                    const testResults: any[] = [];

                    cleanResult.outputs.forEach((outputResult: any) => {
                        const inputStr = outputResult.input || '';
                        const expectedOutput = outputResult.expected || '';
                        const actualOutput = outputResult.actual || '';

                        const isPassed = outputResult.passed !== undefined
                            ? outputResult.passed
                            : (expectedOutput.trim() === actualOutput.trim() && expectedOutput.trim() !== '');

                        testResults.push({
                            input: inputStr,
                            expected: expectedOutput,
                            actual: actualOutput,
                            passed: isPassed
                        });
                    });

                    const hasExpected = testResults.some((res: any) => res.expected && res.expected.trim() !== '');

                    if (!hasExpected) {
                        content += 'Nenhum arquivo de saída esperada.\n\n';
                        testResults.forEach((res: any, index: number) => {
                            content += `--- Teste ${index + 1} ---\n`;
                            if (res.input) { content += `Entrada:\n${res.input}\n`; }
                            content += `Saída Obtida:\n${res.actual}\n\n`;
                        });
                    } else {
                        let passedCount = 0;
                        testResults.forEach((res: any, index: number) => {
                            if (res.passed) { passedCount++; }
                            content += `--- Teste ${index + 1} ---\n`;

                            if (res.input) { content += `Entrada:\n${res.input}\n`; }
                            content += `Saída Esperada:\n${res.expected}\n`;
                            content += `Saída Obtida:\n${res.actual}\n`;
                            content += `Resultado: ${res.passed ? 'Passou' : 'Não Passou'}\n\n`;
                        });
                        const successRate = Math.round((passedCount / testResults.length) * 100);
                        content += `Taxa de Sucesso: ${successRate}%\n`;
                    }
                } else {
                    content += 'Saídas da Execução:\n\n';
                    cleanResult.outputs.forEach((outputResult: any, index: number) => {
                        content += `--- Execução ${index + 1} ---\n`;
                        if (typeof outputResult === 'string') {
                            content += `${outputResult}\n\n`;
                        } else {
                            content += `${JSON.stringify(outputResult, null, 2)}\n\n`;
                        }
                    });
                }
            } else {
                content = cleanResult.message || 'Execução concluída.';
            }
        } else {
            content = cleanResult.message || 'Operação concluída.';
        }

        if (content.length > 250) {
            isComplex = true;
        }

        // --- NOVA LÓGICA DE NEGÓCIO: PERSISTÊNCIA TEMPORÁRIA E LINK DO PDF ---
        let temporaryFilePath = '';
        
        // Guardamos o texto base limpo (para usar na hora da conversão em PDF)
        const rawMarkdownText = content.trim();

        if (isComplex) {
            // 1. Gera o link de comando contendo o conteúdo do relatório codificado em Base64
            const base64Content = Buffer.from(rawMarkdownText).toString('base64');
            content += `\n\n---\n\n[📥 Clique aqui para Exportar este Relatório em PDF](command:codejudge.exportPDF?${encodeURIComponent(JSON.stringify([base64Content]))})`;

            // 2. Cria o nome dinâmico baseado na data/hora
            const agora = new Date();
            const timestamp = agora.toISOString().replace(/[-:.]/g, ""); // Ex: 20260614120000
            const fileName = `codejudge_analise_${timestamp}.md`;

            // 3. Solicita ao gateway que salve fisicamente na pasta temporária do sistema
            temporaryFilePath = this._storageGateway.saveTemporaryMarkdown(fileName, content);
        }

        // Retorna o relatório processado contendo o caminho do arquivo físico para o Controller
        return {
            content: content.trim(),
            rawMarkdownText: rawMarkdownText, // <--- Retornamos o texto limpo (sem o link do botão) caso o controller precise
            filePath: temporaryFilePath,      // <--- O Controller usará esse caminho para abrir no Preview
            isComplex: isComplex,
            success: cleanResult.success !== false,
            language: 'markdown'
        };
    }
}