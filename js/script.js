const tela = document.getElementById("telaJogo");
const contexto = tela.getContext("2d");

const alturaRaquete = 80;
const larguraRaquete = 10;
const raioBola = 7;

let jogador1 = tela.height / 2 - alturaRaquete / 2;
let cpu = tela.height / 2 - alturaRaquete / 2;
let bolaX = tela.width / 2;
let bolaY = tela.height / 2;
let velocidadeBolaX = 4;
let velocidadeBolaY = 4;

let pontosJogador = 0;
let pontosCpu = 0;

const dificuldadeSelect = document.getElementById("dificuldade");
const pontosJogadorSpan = document.getElementById("pontosJogador");
const pontosCpuSpan = document.getElementById("pontosCpu");
const mensagemVencedor = document.getElementById("mensagemVencedor");
const botaoIniciar = document.getElementById("botaoIniciar");
const botaoReiniciar = document.getElementById("botaoReiniciar");

// Sons (lembre-se de ter os arquivos na pasta)
const somBatida = new Audio("Audio/aaaaaaaa-online-audio-converter_r9waVUO.mp3");
const somPonto = new Audio("Audio/somPonto.mp3");

let jogoAtivo = false;

document.addEventListener("mousemove", (evento) => {
  if (!jogoAtivo) return; // só move raquete se jogo ativo

  const retangulo = tela.getBoundingClientRect();
  jogador1 = evento.clientY - retangulo.top - alturaRaquete / 2;

  if (jogador1 < 0) jogador1 = 0;
  if (jogador1 > tela.height - alturaRaquete) jogador1 = tela.height - alturaRaquete;
});

function raquete(x, y, largura, altura, cor) {
  contexto.fillStyle = cor;
  contexto.fillRect(x, y, largura, altura);
}

function bola(x, y, raio, cor) {
  contexto.fillStyle = cor;
  contexto.beginPath();
  contexto.arc(x, y, raio, 0, Math.PI * 2);
  contexto.fill();
}

function reiniciarBola() {
  bolaX = tela.width / 2;
  bolaY = tela.height / 2;
  velocidadeBolaX = -velocidadeBolaX;
  velocidadeBolaY = 4;
}

function desenharJogo() {
  // Fundo
  raquete(0, 0, tela.width, tela.height, "brown");

  // Raquetes
  raquete(10, jogador1, larguraRaquete, alturaRaquete, "white");
  raquete(tela.width - 20, cpu, larguraRaquete, alturaRaquete, "black");

  // Bola
  bola(bolaX, bolaY, raioBola, "green");
}

function verificarVencedor() {
  if (pontosJogador >= 5) {
    mensagemVencedor.textContent = "Você venceu! 🎉";
    jogoAtivo = false;
    botaoReiniciar.style.display = "inline-block";
    return true;
  }
  if (pontosCpu >= 5) {
    mensagemVencedor.textContent = "CPU venceu! 😞";
    jogoAtivo = false;
    botaoReiniciar.style.display = "inline-block";
    return true;
  }
  return false;
}

function atualizarJogo() {
  if (!jogoAtivo) return;

  bolaX += velocidadeBolaX;
  bolaY += velocidadeBolaY;

  if (bolaY + raioBola > tela.height || bolaY - raioBola < 0) {
    velocidadeBolaY = -velocidadeBolaY;
    somBatida.play();
  }

  const dificuldade = parseFloat(dificuldadeSelect.value);
  cpu += (bolaY - (cpu + alturaRaquete / 2)) * dificuldade;

  if (
    bolaX - raioBola < 20 &&
    bolaY > jogador1 &&
    bolaY < jogador1 + alturaRaquete
  ) {
    velocidadeBolaX = -velocidadeBolaX;
    somBatida.play();
  }

  if (
    bolaX + raioBola > tela.width - 20 &&
    bolaY > cpu &&
    bolaY < cpu + alturaRaquete
  ) {
    velocidadeBolaX = -velocidadeBolaX;
    somBatida.play();
  }

  if (bolaX < 0) {
    pontosCpu++;
    pontosCpuSpan.textContent = pontosCpu;
    somPonto.play();
    reiniciarBola();
    if (verificarVencedor()) return;
  }

  if (bolaX > tela.width) {
    pontosJogador++;
    pontosJogadorSpan.textContent = pontosJogador;
    somPonto.play();
    reiniciarBola();
    if (verificarVencedor()) return;
  }
}

function loopJogo() {
  atualizarJogo();
  desenharJogo();
  if (jogoAtivo) {
    requestAnimationFrame(loopJogo);
  }
}

botaoIniciar.addEventListener("click", () => {
  pontosJogador = 0;
  pontosCpu = 0;
  pontosJogadorSpan.textContent = pontosJogador;
  pontosCpuSpan.textContent = pontosCpu;
  mensagemVencedor.textContent = "";
  jogoAtivo = true;
  botaoIniciar.style.display = "none";
  botaoReiniciar.style.display = "none";
  reiniciarBola();
  loopJogo();
});

botaoReiniciar.addEventListener("click", () => {
  pontosJogador = 0;
  pontosCpu = 0;
  pontosJogadorSpan.textContent = pontosJogador;
  pontosCpuSpan.textContent = pontosCpu;
  mensagemVencedor.textContent = "";
  jogoAtivo = true;
  botaoReiniciar.style.display = "none";
  reiniciarBola();
  loopJogo();
});
