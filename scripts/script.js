// Elementos do DOM
const btnLimparDados = document.getElementById('limpar-dados');
const btnSalvarServidor = document.getElementById('salvar-servidor');
const hamburgerIcon = document.getElementById('hamburguer-icon');
const bgMenuLateral = document.getElementById('bg-menu-lateral');
const iconeFecharMenuLateral = document.getElementById('icone-fechar');
const btnLimparDadosLateral = document.getElementById('limpar-dados-lateral');
const btnSalvarServidorLateral = document.getElementById('salvar-servidor-lateral');
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
btnSalvarServidor.addEventListener('click', salvarDadosServidor);
hamburgerIcon.addEventListener('click', abrirMenuLateral);
bgMenuLateral.addEventListener('click', fecharMenuLateral);
iconeFecharMenuLateral.addEventListener('click', fecharMenuLateral);
btnLimparDadosLateral.addEventListener('click', limparDados);
btnSalvarServidorLateral.addEventListener('click', salvarDadosServidor);
novaTransacao.tipo.addEventListener('change', validarTipo);
novaTransacao.mercadoria.addEventListener('keyup', validarMercadoria);
novaTransacao.valor.addEventListener('keyup', validarValor);
btnAdd.addEventListener('click', adicionarTransacao);

// Functions
window.onload = () => {
    transacoes = buscarDadosServidor();
    atualizarExtrato();
}
function formatarValorParaUsuario(valor) {
    return Math.abs(valor).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
function formatarValorRealParaMaquina(valor) {
    return parseFloat(valor.toString().replace(".", "").replace(",", "."));
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
            ? formatarValorRealParaMaquina(novaTransacao.valor.value)
            : 0 - formatarValorRealParaMaquina(novaTransacao.valor.value);
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
    let resposta = confirm(
        `ATENÇÃO!\nEssa ação irá apagar os dados de todas as transações no servidor.\nDeseja continuar?`
    );
    if (resposta) {
        transacoes = [];
        salvarDadosServidor();
        atualizarExtrato();
    }
}
function criarLineTransacao(transacao) {
    const novaLinha = document.createElement('div');
    novaLinha.classList.add("line");
    novaLinha.innerHTML = `
        <div class="transacao">
            <span class="sinal">${transacao.tipo === "venda" ? "+" : "-"}</span>
            <span>${transacao.mercadoria}</span>
        </div>
        <span>R$ ${formatarValorParaUsuario(transacao.valor)}</span>
    `;
    containerLinhasTrasacoes.append(novaLinha);
}
function atualizarExtrato() {
    if (transacoes.length != 0) {
        if ((novaTransacao.tipo.value === "selecione") &&
            (novaTransacao.mercadoria.value === "") &&
            (novaTransacao.valor.value === "")) {
            for (let transacao of transacoes) {
                criarLineTransacao(transacao);
            }
        } else {
            const ultimaTransacao = transacoes[transacoes.length - 1];
            criarLineTransacao(ultimaTransacao);
        }
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
    resultadoTotal.innerText = "R$ " + formatarValorParaUsuario(total);
    sentenca.innerText = (total >= 0) ? "[LUCRO]" : "[PREJUÍZO]";
}
function salvarDadosServidor() {
    if (transacoes.length === 0) {
        localStorage.setItem('transacoesNC', '');
    } else {
        localStorage.setItem('transacoesNC', JSON.stringify(transacoes));
    }
}
function buscarDadosServidor()  {
    let dados;
    if ((localStorage.getItem('transacoesNC') != null) &&
        (localStorage.getItem('transacoesNC') != '')) {
        dados = JSON.parse(localStorage.getItem('transacoesNC'));
    } else {
        dados = [];
    }
    return dados;
}
// Mostrar e exibir menu lateral responsivo
function abrirMenuLateral() {
    bgMenuLateral.classList.remove('esconder');

}
function fecharMenuLateral() {
    bgMenuLateral.classList.add('esconder');
}