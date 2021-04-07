// Elementos do DOM
const tabelaTransacoes = document.getElementById('lista-transacoes');
const containerLinhasTrasacoes = document.getElementById('container-transacoes');
const pNumeroTransacoes = document.getElementById('numero-transacoes');
const semTransacoes = document.getElementById('sem-transacoes');
const resultadoTotal = document.getElementById('resultado-total');
const sentenca = document.getElementById('sentenca');

//Variáveis globais e Listeners
var transacoes = [];

// Functions
window.onload = () => {
    transacoes = buscarDadosServidor();
    atualizarListaTransacoes();
}
function formatarValorParaUsuario(valor) {
    return Math.abs(valor).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
function atualizarListaTransacoes() {
    if (transacoes.length > 0) {
        for (let transacao of transacoes) {
            const novaLinha = document.createElement('div');
            novaLinha.classList.add('container-transacao');
            novaLinha.innerHTML = `
                <div class="descricao-responsivo">
                    <h3>ID:</h3>
                    <h3>Tipo:</h3>
                    <h3>Mercadoria:</h3>
                    <h3>Valor:</h3>
                    <h3>Data:</h3>
                    <h3>Hora:</h3>
                </div>
                <div class="detalhes-transacao">
                    <div>${transacao.id}</div>
                    <div>${(transacao.tipo === "compra") ? "Compra" : "Venda"}</div>
                    <div>${transacao.mercadoria}</div>
                    <div>R$ ${formatarValorParaUsuario(transacao.valor)}</div>
                    <div>${transacao.data}</div>
                    <div>${transacao.hora}</div>
                </div>
            `;
            containerLinhasTrasacoes.append(novaLinha);
        }
        pNumeroTransacoes.innerText = transacoes.length;
        calcularTotal();
        tabelaTransacoes.style.display = "block";
        semTransacoes.style.display = "none";
    }
}
function buscarDadosServidor() {
    let dados;
    const dadosServidor = localStorage.getItem('transacoesNC');
    if ((dadosServidor === null) ||
        (dadosServidor === '')) {
        dados = [];
    } else {
        dados = JSON.parse(dadosServidor);
    }
    return dados;
}
function calcularTotal() {
    let total = 0;
    for (transacao of transacoes) {
        total += transacao.valor;
    }
    resultadoTotal.innerText = "R$ " + formatarValorParaUsuario(total);
    sentenca.innerText = (total >= 0) ? "[LUCRO]" : "[PREJUÍZO]";
}