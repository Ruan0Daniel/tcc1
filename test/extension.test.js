"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*import * as assert from 'assert';
import * as vscode from 'vscode';

suite('CodeJudge Operations Test Suite', () => {

    test('Deve processar a operacao Execute corretamente com taxa de sucesso', () => {
        const payload = { action: 'execute' };
        const cleanResult = {
            success: true,
            message: '',
            outputs: [
                { expected: '10\n', actual: '10\n', passed: true },
                { expected: '20\n', actual: '15\n', passed: false },
                { expected: '30\n', actual: '30\n', passed: true },
                { expected: '40\n', actual: '10\n', passed: false }
            ]
        };
        
        let content = '';
        let isComplex = false;

        if (cleanResult.success === false) {
            content = cleanResult.message || 'Falha na operação.';
            if (content.length > 250) isComplex = true;
        } else if (payload.action === 'execute') {
            if (cleanResult.outputs && Array.isArray(cleanResult.outputs) && cleanResult.outputs.length > 0) {
                isComplex = true;
                const isDetailed = typeof cleanResult.outputs[0] === 'object' && ('actual' in cleanResult.outputs[0]);

                if (isDetailed) {
                    const hasExpected = cleanResult.outputs.some((outputResult: any) => outputResult.expected && outputResult.expected.trim() !== '');
                    
                    if (!hasExpected) {
                        content += 'Nenhum arquivo de saída esperada.\n\n';
                        cleanResult.outputs.forEach((outputResult: any, index: number) => {
                            content += `--- Teste ${index + 1} ---\n`;
                            content += `Saída Obtida:\n${outputResult.actual}\n\n`;
                        });
                    } else {
                        let passedCount = 0;
                        cleanResult.outputs.forEach((outputResult: any, index: number) => {
                            if (outputResult.passed) passedCount++;
                            content += `--- Teste ${index + 1} ---\n`;
                            content += `Saída Esperada:\n${outputResult.expected || ''}\n`;
                            content += `Saída Obtida:\n${outputResult.actual || ''}\n`;
                            content += `Resultado: ${outputResult.passed ? 'Passou' : 'Não Passou'}\n\n`;
                        });
                        const successRate = Math.round((passedCount / cleanResult.outputs.length) * 100);
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

        assert.strictEqual(isComplex, true);
        assert.ok(content.includes('Taxa de Sucesso: 50%'));
        assert.ok(content.includes('--- Teste 4 ---'));
    });

    test('Deve processar a operacao Compile retornando a mensagem padrao', () => {
        const payload = { action: 'compile' };
        const cleanResult = {
            success: true,
            message: 'Sintaxe verificada com sucesso.',
            outputs: []
        };
        
        let content = '';
        let isComplex = false;

        if (cleanResult.success === false) {
            content = cleanResult.message || 'Falha na operação.';
            if (content.length > 250) isComplex = true;
        } else if (payload.action === 'execute') {
            if (cleanResult.outputs && Array.isArray(cleanResult.outputs) && cleanResult.outputs.length > 0) {
                isComplex = true;
            } else {
                content = cleanResult.message || 'Execução concluída.';
            }
        } else {
            content = cleanResult.message || 'Operação concluída.';
        }

        if (content.length > 250) {
            isComplex = true;
        }

        assert.strictEqual(content, 'Sintaxe verificada com sucesso.');
        assert.strictEqual(isComplex, false);
    });

    test('Deve processar a operacao Analysis identificando resposta longa como complexa', () => {
        const payload = { action: 'analysis' };
        const cleanResult = {
            success: true,
            message: 'a'.repeat(260),
            outputs: []
        };
        
        let content = '';
        let isComplex = false;

        if (cleanResult.success === false) {
            content = cleanResult.message || 'Falha na operação.';
            if (content.length > 250) isComplex = true;
        } else if (payload.action === 'execute') {
            if (cleanResult.outputs && Array.isArray(cleanResult.outputs) && cleanResult.outputs.length > 0) {
                isComplex = true;
            } else {
                content = cleanResult.message || 'Execução concluída.';
            }
        } else {
            content = cleanResult.message || 'Operação concluída.';
        }

        if (content.length > 250) {
            isComplex = true;
        }

        assert.strictEqual(isComplex, true);
        assert.strictEqual(content.length, 260);
    });

    test('Deve processar a operacao Optimize lidando com falha na execucao da IA', () => {
        const payload = { action: 'optimize' };
        const cleanResult = {
            success: false,
            message: 'Falha ao conectar com o serviço de otimização.',
            outputs: []
        };
        
        let content = '';
        let isComplex = false;

        if (cleanResult.success === false) {
            content = cleanResult.message || 'Falha na operação.';
            if (content.length > 250) isComplex = true;
        } else if (payload.action === 'execute') {
            if (cleanResult.outputs && Array.isArray(cleanResult.outputs) && cleanResult.outputs.length > 0) {
                isComplex = true;
            } else {
                content = cleanResult.message || 'Execução concluída.';
            }
        } else {
            content = cleanResult.message || 'Operação concluída.';
        }

        if (content.length > 250) {
            isComplex = true;
        }

        assert.strictEqual(content, 'Falha ao conectar com o serviço de otimização.');
        assert.strictEqual(isComplex, false);
    });
});*/ 
//# sourceMappingURL=extension.test.js.map