let hideLogTimeout = null; // Variável para armazenar o temporizador

export function initializeLogBox() {
    const logContent = document.getElementById('log-content');
    const logBox = document.getElementById('log-box');
    const toggleLogButton = document.getElementById('toggle-log');

    if (!logContent || !logBox) {
        console.error("Elemento 'log-content' ou 'log-box' não encontrado!");
        return;
    }

    // Salva a função original do console.log
    const originalConsoleLog = console.log;

    // Substitui o console.log por uma função personalizada
    console.log = function (...args) {
        // Chama o console.log original (opcional)
        originalConsoleLog.apply(console, args);

        // Remove a classe 'hidden' para garantir que a caixa esteja visível
        logBox.classList.remove('hidden');

        // Adiciona um prefixo único às mensagens
        const message = `Sistema: ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`;

        // Adiciona a mensagem à caixa de logs
        const logEntry = document.createElement('div');
        logEntry.textContent = message;
        logContent.appendChild(logEntry);

        // Rola automaticamente para a última mensagem
        logContent.scrollTop = logContent.scrollHeight;

        // Limpa o temporizador anterior e inicia um novo
        clearTimeout(hideLogTimeout);
        hideLogTimeout = setTimeout(() => {
            logBox.classList.add('hidden'); // Oculta a caixa de logs após 3 segundos
        }, 3000); // 3000ms = 3 segundos
    };

    // Adiciona funcionalidade ao botão de alternância
    toggleLogButton.addEventListener('click', () => {
        logBox.classList.toggle('hidden'); // Alterna entre visível e oculto
        toggleLogButton.textContent = logBox.classList.contains('hidden') ? 'Mostrar Logs' : 'Ocultar Logs';
    });
}

// Inicializa a caixa de logs quando o script for carregado
initializeLogBox();