export interface ViewPromptGatewayInterface {
    fetchSinglePrompt(category: string, promptKey: string): Promise<any>;
}