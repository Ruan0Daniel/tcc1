export interface CodeReportGatewayInterface {
    executeTests(statement: string, language: string, code: string, tests: any[]): Promise<any>;
    compile(statement: string, language: string, code: string): Promise<any>;
    analyze(statement: string, language: string, code: string): Promise<any>;
    optimize(statement: string, language: string, code: string): Promise<any>;
}