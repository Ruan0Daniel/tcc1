import { CodeReportGatewayInterface } from "../interfaces/CodeReport/CodeReportGatewayInterface";

export class CodeReportGateway implements CodeReportGatewayInterface{
    constructor(private readonly _apiUrl: string) { }

    public async executeTests(statement: string, language: string, code: string, tests: any[]): Promise<any> {
        return this._post('/execution/run', { statement, language, code, tests });
    }

    public async compile(statement: string, language: string, code: string): Promise<any> {
        return this._post('/compilation/run', { statement, language, code });
    }

    public async analyze(statement: string, language: string, code: string): Promise<any> {
        return this._post('/analysis/run', { statement, language, code });
    }

    public async optimize(statement: string, language: string, code: string): Promise<any> {
        return this._post('/optimization/run', { statement, language, code });
    }

    // Método privado auxiliar para evitar repetição de código fetch
    private async _post(endpoint: string, body: any): Promise<any> {
        const response = await fetch(`${this._apiUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        //console.log(response.json());

        return await response.json();
    }
}