import { FileStorageGatewayInterface } from '../interfaces/FileStorage/FileStorageGatewayInterface';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import PDFDocument from 'pdfkit';

export class FileStorageGateway implements FileStorageGatewayInterface {
    
    /**
     * Salva o Markdown na pasta TEMP do Sistema Operacional
     */
    public saveTemporaryMarkdown(fileName: string, content: string): string {
        const tempDir = os.tmpdir();
        const filePath = path.join(tempDir, fileName);
        
        // Grava o arquivo físico em formato UTF-8
        fs.writeFileSync(filePath, content.trim(), 'utf8');
        
        return filePath;
    }

    /**
     * Transforma o Markdown em PDF usando PDFKit de forma assíncrona
     */
    public async exportToPDF(targetPath: string, markdownContent: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // Cria o documento PDF com margens de 50 pontos (padrão de impressão)
                const doc = new PDFDocument({ margin: 50 });
                const stream = fs.createWriteStream(targetPath);

                // Conecta o gerador do PDF ao arquivo físico no HD
                doc.pipe(stream);

                // 1. Cabeçalho Principal Estilizado
                doc.fontSize(18).font('Helvetica-Bold').text('CodeJudge - Relatório de Análise', { align: 'center' });
                doc.moveDown(2);

                // 2. Interpretador simples de Markdown para o PDF
                const linhas = markdownContent.split('\n');
                
                linhas.forEach(linha => {
                    const linhaLimpa = linha.trim();

                    if (linhaLimpa.startsWith('## ')) {
                        // Trata títulos (## Estruturas de Controle)
                        doc.moveDown(1);
                        doc.fontSize(14).font('Helvetica-Bold').text(linhaLimpa.replace('## ', ''));
                        doc.moveDown(0.5);
                    } else if (linhaLimpa.startsWith('**')) {
                        // Trata linhas que começam com negrito (ex: **Nota**: 10)
                        // Remove os asteriscos para o PDF não printar eles brutos
                        const textoSemAsteriscos = linhaLimpa.replace(/\*\*/g, '');
                        doc.fontSize(10).font('Helvetica-Bold').text(textoSemAsteriscos);
                    } else if (linhaLimpa.startsWith('```')) {
                        // Ignora as linhas de marcação de bloco de código (```java ou ```)
                        // Em um passo futuro, você pode estilizar blocos de código com fundo cinza aqui
                        return;
                    } else if (linhaLimpa === '---') {
                        // Desenha uma linha horizontal real se encontrar os tracejados do MD
                        doc.moveDown(0.5);
                        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').lineWidth(1).stroke();
                        doc.moveDown(1);
                    } else if (linhaLimpa !== '') {
                        // Texto normal ou linhas de código Java
                        doc.fontSize(10).font('Helvetica').text(linhaLimpa);
                    }
                });

                // Finaliza a escrita do PDF
                doc.end();

                // Avisa o sistema quando o arquivo terminou de ser gravado com sucesso
                stream.on('finish', () => resolve());
                stream.on('error', (err) => reject(err));

            } catch (error) {
                reject(error);
            }
        });
    }
}