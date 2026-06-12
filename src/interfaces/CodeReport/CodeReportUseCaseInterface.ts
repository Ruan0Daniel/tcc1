export interface CodeReportUseCaseInterface {
    execute(payload: any, code: string): Promise<any>;
}