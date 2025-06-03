const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

const telaInicial = document.getElementById("tela-inicial");
const telaGameOver = document.getElementById("tela-gameover");
const botaoIniciar = document.getElementById("botao-iniciar");
const botaoReiniciar = document.getElementById("botao-reiniciar");
const botaoVoltar = document.getElementById("botao-voltar");

const pontuacaoDisplay = document.getElementById("pontuacao");
const faseDisplay = document.getElementById("fase");
const hud = document.getElementById("hud");

const somComida = new Audio('audio/comida.mp3');
const somGameOver = new Audio('audio/gameover.mp3');
const somFase = new Audio('audio/fase.mp3');

const tamanhoCelula = 20;
const qtdCelulas = canvas.width / tamanhoCelula;

let cobrinha = [{ x: 10, y: 10 }];
let dx = 1;
let dy = 0;
let comida = { x: 15, y: 15 };
let intervaloJogo = null;
let pontos = 0;
let fase = 1;
let velocidade = 150;

function iniciarJogo() {
  telaInicial.style.display = "none";
  telaGameOver.style.display = "none";
  canvas.style.display = "block";
  hud.style.display = "flex";
  reiniciarEstado();
  intervaloJogo = setInterval(atualizarJogo, velocidade);
}

function reiniciarEstado() {
  cobrinha = [{ x: 10, y: 10 }];
  dx = 1;
  dy = 0;
  comida = gerarComida();
  pontos = 0;
  fase = 1;
  velocidade = 150;
  atualizarHUD();
}

function gerarComida() {
  return {
    x: Math.floor(Math.random() * qtdCelulas),
    y: Math.floor(Math.random() * qtdCelulas),
  };
}

function atualizarHUD() {
  pontuacaoDisplay.textContent = `Pontos: ${pontos}`;
  faseDisplay.textContent = `Fase: ${fase}`;
}

function mostrarGameOver() {
  clearInterval(intervaloJogo);
  somGameOver.play();
  telaGameOver.style.display = "block";
  canvas.style.display = "none";
  hud.style.display = "none";
  document.getElementById("pontuacao-final").textContent = `Pontuação: ${pontos}`;
  document.getElementById("fase-final").textContent = `Fase: ${fase}`;
}

function atualizarJogo() {
  const cabeca = { x: cobrinha[0].x + dx, y: cobrinha[0].y + dy };

  if (
    cabeca.x < 0 ||
    cabeca.y < 0 ||
    cabeca.x >= qtdCelulas ||
    cabeca.y >= qtdCelulas ||
    cobrinha.some((parte) => parte.x === cabeca.x && parte.y === cabeca.y)
  ) {
    mostrarGameOver();
    return;
  }

  cobrinha.unshift(cabeca);

  if (cabeca.x === comida.x && cabeca.y === comida.y) {
    comida = gerarComida();
    pontos++;
    somComida.play();

    if (pontos % 5 === 0) {
      fase++;
      somFase.play();
      velocidade = Math.max(50, velocidade - 10);
      clearInterval(intervaloJogo);
      intervaloJogo = setInterval(atualizarJogo, velocidade);
    }

    atualizarHUD();
  } else {
    cobrinha.pop();
  }

  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  cobrinha.forEach((parte) => {
    ctx.fillRect(
      parte.x * tamanhoCelula,
      parte.y * tamanhoCelula,
      tamanhoCelula,
      tamanhoCelula
    );
  });

  ctx.fillStyle = "red";
  ctx.fillRect(
    comida.x * tamanhoCelula,
    comida.y * tamanhoCelula,
    tamanhoCelula,
    tamanhoCelula
  );
}

document.addEventListener("keydown", (evento) => {
  const tecla = evento.key.toLowerCase();
  if (tecla === "w" && dy !== 1) {
    dx = 0;
    dy = -1;
  }
  if (tecla === "s" && dy !== -1) {
    dx = 0;
    dy = 1;
  }
  if (tecla === "a" && dx !== 1) {
    dx = -1;
    dy = 0;
  }
  if (tecla === "d" && dx !== -1) {
    dx = 1;
    dy = 0;
  }
});

botaoIniciar.addEventListener("click", iniciarJogo);
botaoReiniciar.addEventListener("click", iniciarJogo);
botaoVoltar.addEventListener("click", () => {
  telaGameOver.style.display = "none";
  telaInicial.style.display = "flex";
  hud.style.display = "none";
  canvas.style.display = "none";
});
