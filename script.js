// Variáveis globais e listeners
const tabelaTransacoes = document.getElementById('lista-transacoes');
const semTransacoes = document.getElementById('sem-transacoes');
const containerLinhasTrasacoes = document.getElementById('container-transacoes');
const novaTransacao = {
    tipo: document.getElementById('tipo'),
    mercadoria: document.getElementById('nome-mercadoria'),
    valor: document.getElementById('valor')
};
const pValidarMercadoria = document.getElementById('p-validar-mercadoria');
const pValidarValor = document.getElementById('p-validar-valor');
const btnAdd = document.getElementById('btn-add');

const teclasNumeros = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
var transacoes = [];

novaTransacao.mercadoria.addEventListener('keyup', validarMercadoria);
novaTransacao.valor.addEventListener('keyup', (event) => {
    validarValor();
    preencherValor(event.keyCode);
});
btnAdd.addEventListener('click', adicionarTransacao);

if (transacoes.length != 0) {
    semTransacoes.style.display = 'none';
    tabelaTransacoes.style.display = 'block';
}

// Functions
function adicionarTransacao() {
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

    console.log(teclas);
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
    } else {
        pValidarMercadoria.style.display = "none";
    }
}
function validarValor() {
    const valorTransacaoAtual = novaTransacao.valor.value;
    if (valorTransacaoAtual === "") {
        pValidarValor.style.display = "block";
    } else {
        pValidarValor.style.display = "none";
    }
}

function preencherValor(codigoTecla) {
    /* 
     * Tentar mudar o método de verificação
     * testar se todos os digitos são numbers
     * Caso algum seja NaN, mostrar a mensagem de erro
     * Integrar tudo na função de validarValor
     */
    console.log(codigoTecla);
    var valorTransacaoAtual = novaTransacao.valor.value.toString();
    var digitoValido = false;
    for (let tecla of teclasNumeros) {
        if (codigoTecla == tecla) {
            digitoValido = true;
            break;
        }
    }
    console.log(digitoValido);
    if (!digitoValido) {
        novaTransacao.valor.value = 
        valorTransacaoAtual.substring(0, valorTransacaoAtual.length - 1);
    }
}