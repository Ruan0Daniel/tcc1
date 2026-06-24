export interface ViewPromptUseCaseInterface {
    execute(category: string, promptKey: string): Promise<any>; // <-- Alterado de string para any
}