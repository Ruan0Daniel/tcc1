export interface FileStorageGatewayInterface {
    /**
     * Salva o conteúdo do relatório em um arquivo temporário no formato Markdown (.md)
     * @param fileName Nome do arquivo .md (ex: codejudge_analise_timestamp.md)
     * @param content Conteúdo em Markdown vindo da IA
     * @returns O caminho completo (path) do arquivo .md gerado
     */
    saveTemporaryMarkdown(fileName: string, content: string): string;

    /**
     * Pega um texto em Markdown, converte e exporta como PDF
     */
    exportToPDF(targetPath: string, markdownContent: string): Promise<void>;
}