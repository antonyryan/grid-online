// Sistema de Turnos

// Estrutura de Dados
const personagens = [
    {
        nome: "Jogador",
        hp: 100,
        mp: 50,
        ataque: 20,
        defesa: 10,
        velocidade: 15,
        acoes: ["atacar", "defender", "magia"]
    },
    {
        nome: "Inimigo 1",
        hp: 80,
        mp: 30,
        ataque: 15,
        defesa: 5,
        velocidade: 10,
        acoes: ["atacar"]
    },
    {
        nome: "Inimigo 2",
        hp: 60,
        mp: 20,
        ataque: 10,
        defesa: 5,
        velocidade: 8,
        acoes: ["atacar"]
    }
];

let turnoAtual = 0; // Índice do personagem com o turno ativo
let estadoJogo = "exploracao"; // Estado do jogo ('exploracao', 'combate')

// Função para iniciar o combate
function iniciarCombate() {
    estadoJogo = "combate";
    personagens.sort((a, b) => b.velocidade - a.velocidade); // Ordena por velocidade (maior para menor)
    turnoAtual = 0;
    atualizarUI();
    console.log("Combate iniciado! Ordem dos turnos:", personagens.map(p => p.nome));
}

// Função para avançar para o próximo turno
function proximoTurno() {
    if (estadoJogo !== "combate") return;

    turnoAtual = (turnoAtual + 1) % personagens.length; // Avança para o próximo personagem (circular)
    const personagemAtual = personagens[turnoAtual];

    console.log(`É o turno de ${personagemAtual.nome}`);
    verificarCondicoes(); // Verifica se o combate terminou
    atualizarUI();

    // Se for um inimigo, executa sua IA básica
    if (!personagemAtual.nome.includes("Jogador")) {
        realizarAcaoIA(personagemAtual);
    }
}

// Função para verificar condições de fim de combate
function verificarCondicoes() {
    const jogador = personagens.find(p => p.nome === "Jogador");
    const inimigosVivos = personagens.filter(p => p.nome.includes("Inimigo") && p.hp > 0);

    if (jogador.hp <= 0) {
        console.log("Você perdeu!");
        estadoJogo = "exploracao";
        alert("Fim de jogo! Você foi derrotado.");
    } else if (inimigosVivos.length === 0) {
        console.log("Você venceu!");
        estadoJogo = "exploracao";
        alert("Parabéns! Você derrotou todos os inimigos.");
    }
}

// Funções para as ações disponíveis
function atacar(alvoIndex) {
    const atacante = personagens[turnoAtual];
    const alvo = personagens[alvoIndex];

    const dano = Math.max(0, atacante.ataque - alvo.defesa);
    alvo.hp -= dano;

    console.log(`${atacante.nome} atacou ${alvo.nome} causando ${dano} de dano.`);
    proximoTurno();
}

function defender() {
    const defensor = personagens[turnoAtual];
    defensor.defesa += 5; // Aumenta temporariamente a defesa

    console.log(`${defensor.nome} escolheu defender. Sua defesa aumentou.`);
    proximoTurno();
}

function usarMagia(alvoIndex) {
    const mago = personagens[turnoAtual];
    const alvo = personagens[alvoIndex];

    if (mago.mp >= 10) {
        mago.mp -= 10;
        alvo.hp -= 30; // Dano fixo da magia

        console.log(`${mago.nome} lançou uma magia contra ${alvo.nome}, causando 30 de dano.`);
    } else {
        console.log(`${mago.nome} não tem mana suficiente para usar magia.`);
    }

    proximoTurno();
}

// IA Básica para Inimigos
function realizarAcaoIA(inimigo) {
    const jogador = personagens.find(p => p.nome === "Jogador");
    setTimeout(() => {
        atacar(personagens.indexOf(jogador)); // O inimigo ataca o jogador
    }, 1000); // Simula um pequeno atraso para a ação do inimigo
}

// Interface do Usuário (UI)
function atualizarUI() {
    const statusDiv = document.getElementById("status");
    const logContent = document.getElementById("log-content");

    // Atualiza o status dos personagens
    statusDiv.innerHTML = personagens
        .map(p => `<p>${p.nome}: HP=${p.hp}, MP=${p.mp}</p>`)
        .join("");

    // Exibe logs no console de combate
    logContent.scrollTop = logContent.scrollHeight;
}

document.getElementById("btn-atacar").addEventListener("click", () => {
    const alvo = personagens.find(p => p.nome.includes("Inimigo") && p.hp > 0);
    if (alvo) atacar(personagens.indexOf(alvo));
});

document.getElementById("btn-defender").addEventListener("click", defender);

document.getElementById("btn-magia").addEventListener("click", () => {
    const alvo = personagens.find(p => p.nome.includes("Inimigo") && p.hp > 0);
    if (alvo) usarMagia(personagens.indexOf(alvo));
});