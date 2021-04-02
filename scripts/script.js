// Elementos do DOM
const btnLimparDados = document.getElementById('limpar-dados');
const hamburgerIcon = document.getElementById('hamburguer-icon');
const bgMenuLateral = document.getElementById('bg-menu-lateral');
const iconeFecharMenuLateral = document.getElementById('icone-fechar');
const btnLimparDadosLateral = document.getElementById('limpar-dados-lateral');
const tabelaTransacoes = document.getElementById('lista-transacoes');
const semTransacoes = document.getElementById('sem-transacoes');
const containerLinhasTrasacoes = document.getElementById('container-transacoes');
const novaTransacao = {
    tipo: document.getElementById('tipo'),
    mercadoria: document.getElementById('nome-mercadoria'),
    valor: document.getElementById('valor')
};
const pValidarTipo = document.getElementById('p-validar-tipo');
const pValidarMercadoria = document.getElementById('p-validar-mercadoria');
const pValorVazio = document.getElementById('p-valor-vazio');
const pValorIncompleto = document.getElementById('p-valor-incompleto');
const btnAdd = document.getElementById('btn-add');
const resultadoTotal = document.getElementById('resultado-total');
const sentenca = document.getElementById('sentenca');

// Variáveis globais e listeners
var transacoes = [];

btnLimparDados.addEventListener('click', limparDados);
hamburgerIcon.addEventListener('click', abrirMenuLateral);
bgMenuLateral.addEventListener('click', fecharMenuLateral);
iconeFecharMenuLateral.addEventListener('click', fecharMenuLateral);
btnLimparDadosLateral.addEventListener('click', limparDados);
novaTransacao.tipo.addEventListener('change', validarTipo);
novaTransacao.mercadoria.addEventListener('keyup', validarMercadoria);
novaTransacao.valor.addEventListener('keyup', validarValor);
btnAdd.addEventListener('click', adicionarTransacao);

// Functions
function formatarValor(valor) {
    return Math.abs(valor).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
function validarTipo() {
    const tipoTransacaoAtual = novaTransacao.tipo.value;
    if (tipoTransacaoAtual === "selecione") {
        pValidarTipo.style.display = "block";
        return false;
    } else {
        pValidarTipo.style.display = "none";
        return true;
    }
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
// ---
function adicionarTransacao() {
    const validacaoTipo = validarTipo();
    const validacaoMercadoria = validarMercadoria();
    const validacaoValor = validarValor();
    if (validacaoTipo && validacaoMercadoria && validacaoValor) {
        const tipoTransacaoAtual = novaTransacao.tipo.value;
        const mercadoriaTransacaoAtual = novaTransacao.mercadoria.value;
        const valorTransacaoAtual = (tipoTransacaoAtual === "venda")
            ? parseFloat(novaTransacao.valor.value.toString().replace(".", "").replace(",", "."))
            : 0 - parseFloat(
                novaTransacao.valor.value.toString().replace(".", "").replace(",", ".")
            );
        transacoes.push({
            tipo: tipoTransacaoAtual,
            mercadoria: mercadoriaTransacaoAtual,
            valor: valorTransacaoAtual
        });
        atualizarExtrato();
        calcularTotal();
        limparCampos();
    }
}
function limparDados() {
    transacoes = [];
    atualizarExtrato();
}
function atualizarExtrato() {
    if (transacoes.length != 0) {
        const ultimaTransacao = transacoes[transacoes.length - 1];
        const novaTag = document.createElement('div');
        novaTag.classList.add("line");
        novaTag.innerHTML = `
            <div class="transacao">
                <span class="sinal">${ultimaTransacao.tipo === "venda" ? "+" : "-"}</span>
                <span>${ultimaTransacao.mercadoria}</span>
            </div>
            <span>R$ ${formatarValor(ultimaTransacao.valor)}</span>
        `;
        containerLinhasTrasacoes.append(novaTag);
        semTransacoes.style.display = 'none';
        tabelaTransacoes.style.display = 'block';
    } else {
        containerLinhasTrasacoes.innerHTML = "";
        semTransacoes.style.display = 'block';
        tabelaTransacoes.style.display = 'none';
    }
}
function limparCampos() {
    novaTransacao.tipo.value = "selecione";
    novaTransacao.mercadoria.value = "";
    novaTransacao.valor.value = "";
}
function calcularTotal() {
    let total = 0;
    for (transacao of transacoes) {
        total += transacao.valor;
    }
    resultadoTotal.innerText = "R$ " + formatarValor(total);
    sentenca.innerText = (total >= 0) ? "[LUCRO]" : "[PREJUÍZO]";
}
// Mostrar e exibir menu lateral responsivo
function abrirMenuLateral() {
    bgMenuLateral.classList.remove('esconder');

}
function fecharMenuLateral() {
    bgMenuLateral.classList.add('esconder');
}