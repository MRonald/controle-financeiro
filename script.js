// Elementos do DOM
const btnLimparDados = document.getElementById('limpar-dados');
const btnSalvarServidor = document.getElementById('salvar-servidor');
const hamburgerIcon = document.getElementById('hamburguer-icon');
const bgMenuLateral = document.getElementById('bg-menu-lateral');
const iconeFecharMenuLateral = document.getElementById('icone-fechar');
const btnLimparDadosLateral = document.getElementById('limpar-dados-lateral');
const btnSalvarServidorLateral = document.getElementById('salvar-servidor-lateral');
const imgLoading = document.getElementById('loading');
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
const btnAdd = document.getElementById('btn-add');
const paginacao = document.getElementById('paginacao');
const setaEsquerdaPaginacao = document.getElementById('seta-esquerda');
const setaDireitaPaginacao = document.getElementById('seta-direita');
const spanPaginaAtual = document.getElementById('pag-atual');
const spanTotalPaginas = document.getElementById('total-pag');
const resultadoTotal = document.getElementById('resultado-total');
const sentenca = document.getElementById('sentenca');

// Variáveis globais e listeners
var transacoes;
var paginaAtual = 1;
var primeiroAcesso = true;

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
novaTransacao.valor.addEventListener('input', (e) => {
    e.target.value = mascaraValor(e.target.value);
});
btnAdd.addEventListener('click', adicionarTransacao);
setaEsquerdaPaginacao.addEventListener('click', paginacaoAnterior);
setaDireitaPaginacao.addEventListener('click', paginacaoProxima);

// Functions
window.onload = () => {
    if (sessionStorage.getItem('sessionActive') === null) {
        toogleLoading();
        buscarDadosServidor();
    } else {
        buscarDadosLocalStorage();
        atualizarExtrato();
    }
}
function toogleLoading() {
    const indiceEsconder = imgLoading.classList.toString().indexOf('esconder');
    if (indiceEsconder === -1) {
        imgLoading.classList.add('esconder');
        imgLoading.nextElementSibling.style.display = 'block';
    } else {
        imgLoading.classList.remove('esconder');
        imgLoading.nextElementSibling.style.display = 'none';
    }
}
function formatarValorParaUsuario(valor) {
    return Math.abs(valor).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
function formatarValorRealParaMaquina(valor) {
    return parseFloat(valor.toString().replace('.', '').replace(',', '.'));
}
function validarTipo() {
    const tipoTransacaoAtual = novaTransacao.tipo.value;
    if (tipoTransacaoAtual === 'selecione') {
        pValidarTipo.style.display = 'block';
        novaTransacao.tipo.style.border = '1px solid var(--invalid)';
        return false;
    } else {
        pValidarTipo.style.display = 'none';
        novaTransacao.tipo.style.border = '1px solid var(--gray)';
        return true;
    }
}
function validarMercadoria() {
    const mercadoriaTransacaoAtual = novaTransacao.mercadoria.value;
    if (mercadoriaTransacaoAtual === '') {
        pValidarMercadoria.style.display = 'block';
        novaTransacao.mercadoria.style.border = '1px solid var(--invalid)';
        return false;
    } else {
        pValidarMercadoria.style.display = 'none';
        novaTransacao.mercadoria.style.border = '1px solid var(--gray)';
        return true;
    }
}
function validarValor() {
    const valorTransacaoAtual = novaTransacao.valor.value.toString().substr(3);
    if (valorTransacaoAtual === '') {
        pValorVazio.style.display = 'block';
        novaTransacao.valor.style.border = '1px solid var(--invalid)';
        return false;
    } else {
        pValorVazio.style.display = 'none';
        novaTransacao.valor.style.border = '1px solid var(--gray)';
        return true;
    }
}
function adicionarTransacao() {
    const validacaoTipo = validarTipo();
    const validacaoMercadoria = validarMercadoria();
    const validacaoValor = validarValor();
    if (validacaoTipo && validacaoMercadoria && validacaoValor) {
        const tipoTransacaoAtual = novaTransacao.tipo.value;
        const mercadoriaTransacaoAtual = novaTransacao.mercadoria.value;
        const valorTransacaoAtual = (tipoTransacaoAtual === 'venda')
            ? formatarValorRealParaMaquina(novaTransacao.valor.value.substr(3))
            : 0 - formatarValorRealParaMaquina(novaTransacao.valor.value.substr(3));
        transacoes.push({
            tipo: tipoTransacaoAtual,
            mercadoria: mercadoriaTransacaoAtual,
            valor: valorTransacaoAtual
        });
        salvarDadosLocalStorage();
        atualizarExtrato();
        limparCampos();
    }
}
function limparDados() {
    const confirmacao = confirm(`ATENÇÃO!\nEssa ação irá apagar todos os dados de transações no cache local mas as informações continuarão no servidor.\nDeseja continuar?
    `);
    if (confirmacao) {
        transacoes = [];
        salvarDadosLocalStorage();
        atualizarExtrato();
    }
}
function criarLineTransacao(transacao) {
    const novaLinha = document.createElement('div');
    novaLinha.classList.add('line');
    novaLinha.innerHTML = `
        <div class='transacao'>
            <span class='sinal'>${transacao.tipo === 'venda' ? '+' : '-'}</span>
            <span>${transacao.mercadoria}</span>
        </div>
        <span>R$ ${formatarValorParaUsuario(transacao.valor)}</span>
    `;
    containerLinhasTrasacoes.append(novaLinha);
}
function limparContainerTransacoes() {
    containerLinhasTrasacoes.innerHTML = '';
}
function adicionarItensPaginacao(inicio, fim) {
    for (let i = inicio; i < fim; i++) {
        criarLineTransacao(transacoes[i]);
    }
}
function atualizarExtrato(navegarPaginacao = false) {
    if (transacoes.length != 0) {
        const sobraPaginacao = transacoes.length % 10;
        if (primeiroAcesso) {
            // inicializando o extrato
            if (transacoes.length <= 10) {
                adicionarItensPaginacao(0, transacoes.length);
            } else if (sobraPaginacao === 0) {
                adicionarItensPaginacao(transacoes.length - 10, transacoes.length);
            } else {
                adicionarItensPaginacao(transacoes.length - sobraPaginacao, transacoes.length);
            }
            atualizarPaginacao();
        } else if (!navegarPaginacao) {
            function adicionarUltimaTransacao() {
                const ultimaTransacao = transacoes[transacoes.length - 1];
                criarLineTransacao(ultimaTransacao);
            }
            // Devo estar na última página para inserir uma transação
            const ultimaPagina = parseInt(spanTotalPaginas.innerHTML);
            let isUltimaPagina = paginaAtual === ultimaPagina;
            if (isUltimaPagina && sobraPaginacao === 1 && transacoes.length > 1) {
                criarNovaPagina();
                limparContainerTransacoes();
                adicionarUltimaTransacao();
            } else if (!isUltimaPagina && sobraPaginacao === 1 && transacoes.length > 1) {
                irParaUltimaPagina();
                criarNovaPagina();
                limparContainerTransacoes();
                adicionarUltimaTransacao();
            } else if (isUltimaPagina) {
                adicionarUltimaTransacao();
            } else if (!isUltimaPagina) {
                irParaUltimaPagina();
            }
        } else if (navegarPaginacao) {
            // Caso a página atual seja mudada
            const totalPaginas = parseInt(spanTotalPaginas.innerText);
            limparContainerTransacoes();
            if (paginaAtual !== totalPaginas) {
                const itemInicial = (paginaAtual * 10) - 9;
                adicionarItensPaginacao(itemInicial, itemInicial + 10);
            } else if (sobraPaginacao === 0) {
                adicionarItensPaginacao(transacoes.length - 10, transacoes.length);
            } else {
                adicionarItensPaginacao(transacoes.length - sobraPaginacao, transacoes.length);
            }
        }
        calcularTotal();
        semTransacoes.style.display = 'none';
        tabelaTransacoes.style.display = 'block';
    } else {
        atualizarPaginacao();
        containerLinhasTrasacoes.innerHTML = '';
        semTransacoes.style.display = 'block';
        tabelaTransacoes.style.display = 'none';
    }
}
function atualizarPaginacao() {
    const quantPaginas = transacoes.length / 10;
    if (quantPaginas > 1) {
        paginacao.style.display = 'flex';
        spanTotalPaginas.innerText = Math.ceil(quantPaginas);
        spanPaginaAtual.innerText = paginaAtual;
    } else {
        paginacao.style.display = 'none';
        paginaAtual = 1;
        spanTotalPaginas.innerText = '1';
    }
    if (primeiroAcesso) {
        spanPaginaAtual.innerText = Math.ceil(quantPaginas);
        paginaAtual = Math.ceil(quantPaginas);
        primeiroAcesso = false;
    }
}
function paginacaoAnterior() {
    if (paginaAtual > 1) {
        paginaAtual--;
        atualizarPaginacao();
        atualizarExtrato(true);
    }
}
function paginacaoProxima() {
    const quantPaginas = parseInt(spanTotalPaginas.innerText);
    if (paginaAtual < quantPaginas) {
        paginaAtual++;
        atualizarPaginacao();
        atualizarExtrato(true);
    }
}
function irParaUltimaPagina() {
    const ultimaPagina = parseInt(spanTotalPaginas.innerText);
    paginaAtual = ultimaPagina;
    atualizarPaginacao();
    atualizarExtrato(true);
}
function criarNovaPagina() {
    paginaAtual++;
    atualizarPaginacao();
    atualizarExtrato(true);
}
function limparCampos() {
    novaTransacao.tipo.value = 'selecione';
    novaTransacao.mercadoria.value = '';
    novaTransacao.valor.value = '';
}
function calcularTotal() {
    let total = 0;
    for (transacao of transacoes) {
        total += transacao.valor;
    }
    resultadoTotal.innerText = 'R$ ' + formatarValorParaUsuario(total);
    sentenca.innerText = (total >= 0) ? '[LUCRO]' : '[PREJUÍZO]';
}
function salvarDadosLocalStorage() {
    if (transacoes.length === 0) {
        localStorage.setItem('transacoesNC', '');
    } else {
        localStorage.setItem('transacoesNC', JSON.stringify(transacoes));
    }
}
function buscarDadosLocalStorage()  {
    if ((localStorage.getItem('transacoesNC') != null) &&
        (localStorage.getItem('transacoesNC') != '')) {
        transacoes = JSON.parse(localStorage.getItem('transacoesNC'));
    } else {
        transacoes = [];
    }
}
function salvarDadosServidor() {
    const corpoRequisicao = `
    {
        "records": [
            {
                "id": "reckDQ6hmpeCC9Squ",
                "fields": {
                    "Aluno": "1452",
                    "Json": "${JSON.stringify(transacoes).replace(/["]/g, "'")}"
                }
            }
        ]
    }
    `;
    fetch('https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico', {
        method: 'PATCH',
        headers: {
            Authorization: 'Bearer key2CwkHb0CKumjuM',
            'Content-Type': 'application/json'
        },
        body: corpoRequisicao
    }).catch(e => console.error('Não consegui fazer a atualização dos dados --> ' + e));
}
function buscarDadosServidor() {
    fetch('https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico/reckDQ6hmpeCC9Squ', {
        headers: {
            Authorization: 'Bearer key2CwkHb0CKumjuM'
        }
    }).then(
        response => response.json()
    ).then(responseJson => {
        const dados = responseJson.fields.Json.replace(/'/g, '"');
        transacoes = JSON.parse(dados);
        salvarDadosLocalStorage();
        atualizarExtrato();
        sessionStorage.setItem('sessionActive', 'true');
        toogleLoading();
    });
}
// Mostrar e exibir menu lateral responsivo
function abrirMenuLateral() {
    bgMenuLateral.classList.remove('esconder');
}
function fecharMenuLateral() {
    bgMenuLateral.classList.add('esconder');
}
// Máscara valor contábil
function mascaraValor(valorCampo) {
    valorCampo = parseInt(valorCampo.replace(/\D/g, '')).toString();
    let valorFormatado = '';
    if (valorCampo === '0' || valorCampo === 'NaN') {
        valorFormatado = '';
    } else if (valorCampo.length === 1) {
        valorFormatado += '00' + valorCampo;
    } else if (valorCampo.length === 2) {
        valorFormatado += '0' + valorCampo;
    } else {
        valorFormatado = valorCampo;
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
        valorFormatado = 'R$ ' + valorFormatado;
    }
    return valorFormatado;
}