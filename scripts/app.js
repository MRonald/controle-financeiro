// Elementos do DOM
const btnLimparDados = document.getElementById('limpar-dados');
const btnSalvarServidor = document.getElementById('salvar-servidor');
const btnLimparDadosLateral = document.getElementById('limpar-dados-lateral');
const btnSalvarServidorLateral = document.getElementById('salvar-servidor-lateral');
const tabelaTransacoes = document.getElementById('lista-transacoes');
const semTransacoes = document.getElementById('sem-transacoes');
const containerLinhasTrasacoes = document.getElementById('container-transacoes');
const novaTransacao = {
    tipo: document.getElementById('tipo'),
    mercadoria: document.getElementById('nome-mercadoria'),
    valor: document.getElementById('valor'),
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
btnSalvarServidor.addEventListener('click', salvarDadosServidor);
btnLimparDadosLateral.addEventListener('click', limparDados);
btnSalvarServidorLateral.addEventListener('click', salvarDadosServidor);
novaTransacao.tipo.addEventListener('change', validarTipo);
novaTransacao.mercadoria.addEventListener('keyup', validarMercadoria);
novaTransacao.valor.addEventListener('keyup', validarValor);
novaTransacao.valor.addEventListener('input', (e) => {
    e.target.value = mascaraValor(e.data, e.inputType);
});
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
function getDataAtual() {
    const data = new Date();
    let dia = data.getDate();
    if (dia < 10) {
        dia = `0${dia}`;
    }
    let mes = data.getMonth() + 1;
    if (mes < 10) {
        mes = `0${mes}`;
    }
    let ano = data.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;
    return dataFormatada;
}
function getHoraAtual() {
    const data = new Date();
    let hora = data.getHours();
    if (hora < 10) {
        hora = `0${hora}`;
    }
    let minutos = data.getMinutes();
    if (minutos < 10) {
        minutos = `0${minutos}`;
    }
    const horaFormatada = `${hora}:${minutos}`;
    return horaFormatada;
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
function adicionarTransacao() {
    const validacaoTipo = validarTipo();
    const validacaoMercadoria = validarMercadoria();
    const validacaoValor = validarValor();
    if (validacaoTipo && validacaoMercadoria && validacaoValor) {
        let ultimaTransacao;
        if (transacoes.length > 0) {
            ultimaTransacao = transacoes[transacoes.length - 1];
        } else {
            ultimaTransacao = undefined;
        }
        const id = (ultimaTransacao !== undefined)
            ? ultimaTransacao.id + 1
            : 1;
        const tipoTransacaoAtual = novaTransacao.tipo.value;
        const mercadoriaTransacaoAtual = novaTransacao.mercadoria.value;
        const valorTransacaoAtual = (tipoTransacaoAtual === "venda")
            ? formatarValorRealParaMaquina(novaTransacao.valor.value)
            : 0 - formatarValorRealParaMaquina(novaTransacao.valor.value);
        const dataTransacaoAtual = getDataAtual();
        const horaTransacaoAtual = getHoraAtual();
        transacoes.push({
            id: id,
            tipo: tipoTransacaoAtual,
            mercadoria: mercadoriaTransacaoAtual,
            valor: valorTransacaoAtual,
            data: dataTransacaoAtual,
            hora: horaTransacaoAtual
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
    const dadosServidor = localStorage.getItem('transacoesNC');
    if ((dadosServidor === null) ||
        (dadosServidor === '')) {
        dados = [];
    } else {
        dados = JSON.parse(dadosServidor);
    }
    return dados;
}
// Máscara valor contábil
function mascaraValor(digito, tipoDeEntrada) {
    const digitosValidos = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
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
    if (digitosCampoValor.length <= 2) {
        valorFormatado = digitosCampoValor;
        return valorFormatado;
    }
    if (digitosCampoValor.length >= 3) {
        const doisUltimos = digitosCampoValor.substr(-2);
        const resto = digitosCampoValor.substr(0, digitosCampoValor.length - 2);
        valorFormatado = resto + ',' + doisUltimos;
        if (valorFormatado.length >= 7) {
            const ultimosSeis = valorFormatado.substr(-6);
            const resto = valorFormatado.substr(0, valorFormatado.length - 6);
            valorFormatado = resto + '.' + ultimosSeis;
            if (valorFormatado.length >= 11) {
                const ultimosDez = valorFormatado.substr(-10);
                const resto = valorFormatado.substr(0, valorFormatado.length - 10);
                valorFormatado = resto + '.' + ultimosDez;
                if (valorFormatado.length >= 15) {
                    const ultimosQuatorze = valorFormatado.substr(-14);
                    const resto = valorFormatado.substr(0, valorFormatado.length - 14);
                    valorFormatado = resto + '.' + ultimosQuatorze;
                }
            }
        }
        return valorFormatado;
    }
}