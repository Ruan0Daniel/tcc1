# CodeJudge

O CodeJudge é uma extensão para o Visual Studio Code projetada para executar, compilar, analisar e otimizar códigos diretamente no seu editor. Focada no aprendizado e aprimoramento contínuo, a extensão fornece feedbacks detalhados e permite testes automatizados baseados em arquivos de entrada e saída.

## Recursos

* **Executar:** Roda seu código em tempo real. Permite anexar arquivos de entrada e de saída esperada (`.txt`) para validar seu algoritmo. O sistema realiza testes automatizados, exibindo a taxa de sucesso e um comparativo claro entre o resultado obtido e o esperado.
* **Compilar:** Faz a verificação de sintaxe e estrutura do seu arquivo. Caso a compilação falhe, exibe um feedback pedagógico focado na resolução do erro para facilitar seu aprendizado.
* **Analisar:** Avalia a qualidade do código aberto, trazendo recomendações de boas práticas e caminhos para você refatorar e aprimorar sua lógica.
* **Otimizar:** Avalia o algoritmo puramente em quesitos de performance, oferecendo insights para torná-lo mais rápido e eficiente no consumo de memória.
* **Contexto de Exercício:** Permite inserir o enunciado do problema para que os feedbacks sejam direcionados e exatos em relação ao que foi pedido.

## Como Usar

1. Abra o painel lateral do CodeJudge no VS Code.
2. (Opcional) Insira o enunciado do exercício para dar mais contexto.
3. Selecione a linguagem do seu código atual (ex: Java, C).
4. Escolha a ação desejada (Executar, Compilar, Analisar ou Otimizar).
5. Se for **Executar**, você pode expandir a "Configuração de Testes" para adicionar seus arquivos `.txt` de entrada e/ou saída esperada.
6. Clique em "Processar" e os resultados detalhados (ou testes comparativos) abrirão diretamente em uma nova aba do seu editor.

## Problemas Conhecidos

* Anexar arquivos de entrada e saída extremamente pesados pode causar um leve atraso na renderização visual do painel antes do envio.

## Notas de Atualização

### 1.0.0

Lançamento inicial do CodeJudge.

* Interface interativa no Webview do VS Code.
* Upload de testes dinâmicos em formato `.txt`.
* Ações de processamento: Execute, Compile, Analysis e Optimize.
* Cálculo de taxa de sucesso e divisão automática de resultados em nova aba.