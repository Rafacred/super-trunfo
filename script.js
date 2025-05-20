let cartas = [
  {
    nome: "Cavaleiro",
    imagem: "imagens/cavaleiro.jpg",
    atributos: { ataque: 8, defesa: 7, magia: 2 }
  },
  {
    nome: "Mago",
    imagem: "imagens/mago.jpg",
    atributos: { ataque: 5, defesa: 4, magia: 9 }
  },
  {
    nome: "Guerreiro",
    imagem: "imagens/guerreiro.jpg",
    atributos: { ataque: 7, defesa: 8, magia: 1 }
  }
];

let cartaJogador, cartaMaquina;
let pontosJogador = 0;
let pontosMaquina = 0;

function sortearCarta() {
  let indiceMaquina = Math.floor(Math.random() * cartas.length);
  cartaMaquina = cartas[indiceMaquina];

  let indiceJogador;
  do {
    indiceJogador = Math.floor(Math.random() * cartas.length);
  } while (indiceJogador === indiceMaquina);

  cartaJogador = cartas[indiceJogador];

  exibirCarta("jogador");
  document.getElementById("carta-maquina").innerHTML = "";
  document.getElementById("resultado").innerText = "";
  document.getElementById("btnJogar").disabled = false;
}

function exibirCarta(tipo) {
  const carta = tipo === "jogador" ? cartaJogador : cartaMaquina;
  const div = document.getElementById(`carta-${tipo}`);
  div.innerHTML = `<h3>${carta.nome}</h3>
                   <img src="${carta.imagem}" alt="${carta.nome}">`;

  let opcoesHTML = "";
  for (let atributo in carta.atributos) {
    if (tipo === "jogador") {
      opcoesHTML += `<input type="radio" name="atributo" value="${atributo}"> ${atributo}: ${carta.atributos[atributo]}<br>`;
    } else {
      opcoesHTML += `${atributo}: ${carta.atributos[atributo]}<br>`;
    }
  }

  if (tipo === "jogador") {
    document.getElementById("opcoes").innerHTML = opcoesHTML;
  } else {
    div.innerHTML += opcoesHTML;
  }
}

function obtemAtributoSelecionado() {
  const radios = document.getElementsByName("atributo");
  for (let radio of radios) {
    if (radio.checked) return radio.value;
  }
}

function jogar() {
  const atributo = obtemAtributoSelecionado();
  if (!atributo) {
    alert("Selecione um atributo!");
    return;
  }

  let valorJogador = cartaJogador.atributos[atributo];
  let valorMaquina = cartaMaquina.atributos[atributo];
  let resultado = "";

  if (valorJogador > valorMaquina) {
    pontosJogador++;
    resultado = "Você venceu esta rodada!";
  } else if (valorJogador < valorMaquina) {
    pontosMaquina++;
    resultado = "Você perdeu esta rodada!";
  } else {
    resultado = "Empate!";
  }

  atualizarPlacar();
  exibirCarta("maquina");
  document.getElementById("resultado").innerHTML = `<strong>${resultado}</strong>`;
  document.getElementById("btnJogar").disabled = true;

  if (pontosJogador >= 5 || pontosMaquina >= 5) {
    fimDeJogo();
  }
}

function atualizarPlacar() {
  document.getElementById("placar").innerText = `Você: ${pontosJogador} | Máquina: ${pontosMaquina}`;
}

function fimDeJogo() {
  let vencedor = pontosJogador > pontosMaquina ? "Você venceu o jogo!" : "A máquina venceu!";
  alert(vencedor);
  salvarRanking(pontosJogador, pontosMaquina);
  pontosJogador = 0;
  pontosMaquina = 0;
  atualizarPlacar();
  document.getElementById("carta-jogador").innerHTML = "";
  document.getElementById("carta-maquina").innerHTML = "";
  document.getElementById("opcoes").innerHTML = "";
  document.getElementById("resultado").innerHTML = "";
}

function salvarRanking(pJog, pMaq) {
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push({
    resultado: pJog > pMaq ? "Vitória" : "Derrota",
    data: new Date().toLocaleString()
  });
  localStorage.setItem("ranking", JSON.stringify(ranking));
  exibirRanking();
}

function exibirRanking() {
  const lista = document.getElementById("lista-ranking");
  lista.innerHTML = "";
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];

  ranking.slice(-5).reverse().forEach((partida) => {
    const li = document.createElement("li");
    li.innerText = `${partida.data} - ${partida.resultado}`;
    lista.appendChild(li);
  });
}

window.onload = exibirRanking;
