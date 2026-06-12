export interface ViewPromptUseCaseInterface {
    execute(category: string, promptKey: string): Promise<string>;
}