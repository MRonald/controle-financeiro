// Elementos do DOM
const tabelaTransacoes = document.getElementById('lista-transacoes');
const semTransacoes = document.getElementById('sem-transacoes');
const containerLinhasTrasacoes = document.getElementById('container-transacoes');
const novaTransacao = {
    tipo: document.getElementById('tipo'),
    mercadoria: document.getElementById('nome-mercadoria'),
    valor: document.getElementById('valor')
};
const pValidarMercadoria = document.getElementById('p-validar-mercadoria');
const pValorVazio = document.getElementById('p-valor-vazio');
const pValorIncompleto = document.getElementById('p-valor-incompleto');
const btnAdd = document.getElementById('btn-add');

// Variáveis globais e listeners
var transacoes = [];

novaTransacao.mercadoria.addEventListener('keyup', validarMercadoria);
novaTransacao.valor.addEventListener('keyup', validarValor);
btnAdd.addEventListener('click', adicionarTransacao);

if (transacoes.length != 0) {
    semTransacoes.style.display = 'none';
    tabelaTransacoes.style.display = 'block';
}

// Functions
function adicionarTransacao() {
    const validacaoMercadoria = validarMercadoria();
    const validacaoValor = validarValor();
    if (validacaoMercadoria && validacaoValor) {
        const tipoTransacaoAtual = novaTransacao.tipo.value;
        const mercadoriaTransacaoAtual = novaTransacao.mercadoria.value;
        const valorTransacaoAtual = parseFloat(novaTransacao.valor.value);
        transacoes.push({
            tipo: tipoTransacaoAtual,
            mercadoria: mercadoriaTransacaoAtual,
            valor: valorTransacaoAtual
        });
        atualizarExtrato();
        limparCampos();
    }
}
function atualizarExtrato() {
    if (transacoes.length === 1 || transacoes.length === 0) {
        if (transacoes.length != 0) {
            semTransacoes.style.display = 'none';
            tabelaTransacoes.style.display = 'block';
        } else {
            semTransacoes.style.display = 'block';
            tabelaTransacoes.style.display = 'none';
        }
    }
    const ultimaAdicao = transacoes[transacoes.length - 1];
    const novaTag = `
    <div class="line">
        <div class="transacao">
            <span class="sinal">${ultimaAdicao.tipo === "venda" ? "+" : "-"}</span>
            <span>${ultimaAdicao.mercadoria}</span>
        </div>
        <span>R$ ${ultimaAdicao.valor}</span>
    </div>
    `;
    containerLinhasTrasacoes.innerHTML += novaTag;
}
function limparCampos() {
    novaTransacao.mercadoria.value = "";
    novaTransacao.valor.value = "";
}
function validarMercadoria() {
    const mercadoriaTransacaoAtual = novaTransacao.mercadoria.value;
    if (mercadoriaTransacaoAtual === "") {
        pValidarMercadoria.style.display = "block";
        return false;
    } else {
        pValidarMercadoria.style.display = "none";
        return true;
    }
}
function validarValor() {
    const valorTransacaoAtual = novaTransacao.valor.value.toString();
    if (valorTransacaoAtual === "") {
        pValorVazio.style.display = "block";
    } else {
        pValorVazio.style.display = "none";
    }
    if (valorTransacaoAtual.length > 0 && valorTransacaoAtual.length < 4) {
        pValorIncompleto.style.display = "block";
    } else {
        pValorIncompleto.style.display = "none";
    }
    if (pValorVazio.style.display === "none" &&
        pValorIncompleto.style.display === "none") {
        return true;
    } else {
        return false;
    }
}
// Masks jQuery
$(document).ready(function() {
    $("#valor").mask("999.999.999.990,00", {reverse: true});
});