// src/webview/script.js
const vscode = acquireVsCodeApi();

const elements = {
    action: document.getElementById('action'),
    testContainer: document.getElementById('testFilesContainer'),

    testHeader: document.getElementById('testConfigHeader'),
    testContent: document.getElementById('testConfigContent'),
    testIcon: document.getElementById('testConfigIcon'),

    promptsHeader: document.getElementById('promptsHeader'),
    promptsContent: document.getElementById('promptsContent'),
    promptsIcon: document.getElementById('promptsIcon'),
    promptSelect: document.getElementById('promptSelect'),
    viewPromptBtn: document.getElementById('viewPromptBtn'),

    inputFile: document.getElementById('inputFile'),
    inputName: document.getElementById('inputFileName'),
    removeInputBtn: document.getElementById('removeInputBtn'),
    inputPreview: document.getElementById('inputPreview'),

    outputFile: document.getElementById('outputFile'),
    outputName: document.getElementById('outputFileName'),
    removeOutputBtn: document.getElementById('removeOutputBtn'),
    outputPreview: document.getElementById('outputPreview'),

    btn: document.getElementById('processBtn'),
    statement: document.getElementById('statement'),
    language: document.getElementById('language')
};

let promptsLoaded = false;

function toggleInfo(id) {
    const infoBox = document.getElementById(id);
    if (infoBox.classList.contains('active')) {
        infoBox.classList.remove('active');
    } else {
        document.querySelectorAll('.info-content').forEach(el => el.classList.remove('active'));
        infoBox.classList.add('active');
    }
}

elements.testHeader.addEventListener('click', () => {
    if (elements.testContent.style.display === 'none') {
        elements.testContent.style.display = 'block';
        elements.testIcon.textContent = '▼';
    } else {
        elements.testContent.style.display = 'none';
        elements.testIcon.textContent = '▶';
    }
});

// A função agora apenas solicita os prompts para o ecossistema do VS Code
function loadPrompts() {
    elements.promptSelect.innerHTML = '<option value="">Carregando prompts...</option>';
    vscode.postMessage({ type: 'fetch-all-prompts' }); 
}

elements.promptsHeader.addEventListener('click', () => {
    if (elements.promptsContent.style.display === 'none') {
        elements.promptsContent.style.display = 'block';
        elements.promptsIcon.textContent = '▼';
        if (!promptsLoaded) {
            loadPrompts();
        }
    } else {
        elements.promptsContent.style.display = 'none';
        elements.promptsIcon.textContent = '▶';
    }
});

elements.viewPromptBtn.addEventListener('click', () => {
    const val = elements.promptSelect.value;
    if (val) {
        try {
            const parsed = JSON.parse(val);
            vscode.postMessage({
                type: 'view-selected-prompt', // Ajustado para o padrão de rotas
                payload: parsed
            });
        } catch (e) {
            // Falha silenciosa
        }
    }
});

elements.action.addEventListener('change', (event) => {
    elements.testContainer.style.display = event.target.value === 'execute' ? 'block' : 'none';
});

function clearFile(inputElement, nameElement, previewElement, removeBtn) {
    inputElement.value = '';
    nameElement.textContent = 'Nenhum arquivo';
    nameElement.title = '';
    removeBtn.style.display = 'none';
    previewElement.textContent = '';
    previewElement.style.display = 'none';
}

function handleFileUpload(inputElement, nameElement, previewElement, removeBtn) {
    inputElement.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            nameElement.textContent = file.name;
            nameElement.title = file.name;
            removeBtn.style.display = 'inline-block';

            try {
                const text = await file.text();
                previewElement.textContent = text;
                previewElement.style.display = 'block';
            } catch (e) {
                previewElement.textContent = 'Erro ao ler arquivo.';
                previewElement.style.display = 'block';
            }
        } else {
            clearFile(inputElement, nameElement, previewElement, removeBtn);
        }
    });

    removeBtn.addEventListener('click', () => {
        clearFile(inputElement, nameElement, previewElement, removeBtn);
    });
}

handleFileUpload(elements.inputFile, elements.inputName, elements.inputPreview, elements.removeInputBtn);
handleFileUpload(elements.outputFile, elements.outputName, elements.outputPreview, elements.removeOutputBtn);

async function getFileText(fileInput) {
    const file = fileInput.files[0];
    if (!file) return '';
    try {
        return await file.text();
    } catch (error) {
        return '';
    }
}

async function parseFiles(inputFileElement, outputFileElement) {
    if (!inputFileElement.files[0] && !outputFileElement.files[0]) return [];

    const inputStr = await getFileText(inputFileElement);
    const expectedStr = await getFileText(outputFileElement);

    const inputLines = inputStr.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '');
    const expectedLines = expectedStr.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '');

    return inputLines.map((line, i) => ({
        input: line,
        expected: expectedLines[i] || ''
    }));
}

// Escutador centralizado de respostas vindas do Provider (TypeScript)
window.addEventListener('message', event => {
    const message = event.data;
    
    switch (message.type) {
        case 'response-process':
            elements.btn.disabled = false;
            elements.btn.textContent = 'Processar';
            break;

        case 'response-fetch-all-prompts': 
            const templates = message.payload.templates || {};
            elements.promptSelect.innerHTML = '';

            Object.keys(templates).forEach(category => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = category.charAt(0).toUpperCase() + category.slice(1);

                Object.keys(templates[category]).forEach(promptKey => {
                    const prompt = templates[category][promptKey];
                    const name = prompt.metadata?.name || promptKey;
                    const option = document.createElement('option');
                    option.value = JSON.stringify({ category, promptKey });
                    option.textContent = name;
                    optgroup.appendChild(option);
                });
                elements.promptSelect.appendChild(optgroup);
            });
            promptsLoaded = true;
            break;

        case 'response-fetch-all-prompts-error':
            // Ajustado para o padrão de erro também
            elements.promptSelect.innerHTML = `<option value="">${message.payload.error}</option>`;
            promptsLoaded = false;
            break;
    }
});

elements.btn.addEventListener('click', async () => {
    elements.btn.disabled = true;
    elements.btn.textContent = 'Processando...';

    try {
        const statement = elements.statement.value.trim();
        const language = elements.language.value;
        const action = elements.action.value;

        let tests = [];

        if (action === 'execute') {
            tests = await parseFiles(elements.inputFile, elements.outputFile);
        }

        vscode.postMessage({
            type: 'process',
            payload: { statement, language, action, tests }
        });
    } catch (e) {
        elements.btn.disabled = false;
        elements.btn.textContent = 'Processar';
    }
});