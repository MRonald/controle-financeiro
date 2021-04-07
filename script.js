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
var digitosCampoValor = '';

btnLimparDados.addEventListener('click', limparDados);
hamburgerIcon.addEventListener('click', abrirMenuLateral);
bgMenuLateral.addEventListener('click', fecharMenuLateral);
iconeFecharMenuLateral.addEventListener('click', fecharMenuLateral);
btnLimparDadosLateral.addEventListener('click', limparDados);
novaTransacao.tipo.addEventListener('change', validarTipo);
novaTransacao.mercadoria.addEventListener('keyup', validarMercadoria);
novaTransacao.valor.addEventListener('keyup', validarValor);
novaTransacao.valor.addEventListener('input', (e) => {
    e.target.value = mascaraValor(e.data, e.inputType);
})
btnAdd.addEventListener('click', adicionarTransacao);

// Functions
window.onload = () => {
    transacoes = buscarDadosLocalStorage();
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
        novaTransacao.tipo.style.border = '1px solid var(--invalid)';
        return false;
    } else {
        pValidarTipo.style.display = "none";
        novaTransacao.tipo.style.border = '1px solid var(--gray)';
        return true;
    }
}
function validarMercadoria() {
    const mercadoriaTransacaoAtual = novaTransacao.mercadoria.value;
    if (mercadoriaTransacaoAtual === "") {
        pValidarMercadoria.style.display = "block";
        novaTransacao.mercadoria.style.border = '1px solid var(--invalid)';
        return false;
    } else {
        pValidarMercadoria.style.display = "none";
        novaTransacao.mercadoria.style.border = '1px solid var(--gray)';
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
        novaTransacao.valor.style.border = '1px solid var(--gray)';
        return true;
    } else {
        novaTransacao.valor.style.border = '1px solid var(--invalid)';
        return false;
    }
}
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
        salvarDadosLocalStorage();
        atualizarExtrato();
        calcularTotal();
        limparCampos();
        digitosCampoValor = '';
    }
}
function limparDados() {
    transacoes = [];
    salvarDadosLocalStorage();
    atualizarExtrato();
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
function salvarDadosLocalStorage() {
    if (transacoes.length === 0) {
        localStorage.setItem('transacoesNC', '');
    } else {
        localStorage.setItem('transacoesNC', JSON.stringify(transacoes));
    }
}
function buscarDadosLocalStorage()  {
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
// Máscara valor contábil
function mascaraValor(digito, tipoDeEntrada) {
    const digitosValidos = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let digitoValido = false;
    for (let dig of digitosValidos) {
        if (dig == digito) {
            digitoValido = true;
        }
    }
    if ((tipoDeEntrada === 'deleteContentBackward') ||
        (tipoDeEntrada === 'deleteContentForward')) {
        digitosCampoValor = digitosCampoValor.substr(0, digitosCampoValor.length - 1);
    }
    if (digitoValido) {
        digitosCampoValor += digito;
    }
    let valorFormatado = '';
    if (digitosCampoValor.length === 1) {
        valorFormatado += '00' + digitosCampoValor;
    } else if (digitosCampoValor.length === 2) {
        valorFormatado += '0' + digitosCampoValor;
    } else {
        valorFormatado = digitosCampoValor;
    }
    if (valorFormatado.length > 0) {
        const doisUltimos = valorFormatado.substr(-2);
        const resto = valorFormatado.substr(0, valorFormatado.length - 2);
        valorFormatado = resto + ',' + doisUltimos;
        if (valorFormatado.length >= 7) {
            const ultimosSeis = valorFormatado.substr(-6);
            const resto = valorFormatado.substr(0, valorFormatado.length - 6);
            valorFormatado = resto + '.' + ultimosSeis;
        }
    }
    return valorFormatado;
}