// Elementos do DOM
const pUsuarioRepetido = document.getElementById('erro');
const nomeCompleto = document.getElementById('nome-completo');
const pNomeIncompleto = document.getElementById('p-nome-incompleto');
const novaSenha = document.getElementById('nova-senha');
const novaSenhaConfirm = document.getElementById('nova-senha-confirm');
const btnSubmit = document.getElementById('btn-submit');

// Variáveis globais e Listeners
var usuarios = [];

nomeCompleto.addEventListener('keyup', verificarCampoNome);
novaSenha.addEventListener('keyup', verificarCampoSenha);
novaSenhaConfirm.addEventListener('keyup', verificarCampoSenhaConfirm);
btnSubmit.addEventListener('click', cadastrarUsuario);

// Functions
window.onload = () => {
    usuarios = buscarUsuariosServidor();
}
function gerarNomeUsuario() {
    const nomeCompletoSplit = nomeCompleto.value.split(' ');
    const primeiroNome = nomeCompletoSplit[0].toLowerCase();
    const ultimoNome = nomeCompletoSplit[nomeCompletoSplit.length - 1].toLowerCase();
    const novoNomeUsuario = primeiroNome + '_' + ultimoNome;
    return novoNomeUsuario;
}
function verificarCampoNome() {
    const pCampoInvalido = nomeCompleto.nextElementSibling;
    const valorCampo = nomeCompleto.value.trim();
    if (valorCampo === '') {
        pCampoInvalido.style.display = 'block';
        pNomeIncompleto.style.display = 'none';
        nomeCompleto.style.border = '1px solid var(--invalid)';
        return false;
    } else {
        if (valorCampo.indexOf(' ') === -1) {
            pCampoInvalido.style.display = 'none';
            pNomeIncompleto.style.display = 'block';
            nomeCompleto.style.border = '1px solid var(--invalid)';
            return false;
        } else {
            pCampoInvalido.style.display = 'none';
            pNomeIncompleto.style.display = 'none';
            nomeCompleto.style.border = 'none';
            return true;
        }
    }
}
function verificarCampoSenha() {
    const pCampoInvalido = novaSenha.nextElementSibling;
    if (novaSenha.value === '') {
        pCampoInvalido.style.display = 'block';
        novaSenha.style.border = '1px solid var(--invalid)';
        return false;
    } else {
        pCampoInvalido.style.display = 'none';
        novaSenha.style.border = 'none';
        return true;
    }
}
function verificarCampoSenhaConfirm() {
    const pCampoInvalido = novaSenhaConfirm.nextElementSibling;
    if (novaSenhaConfirm.value === '') {
        pCampoInvalido.style.display = 'block';
        novaSenhaConfirm.style.border = '1px solid var(--invalid)';
        return false;
    } else {
        pCampoInvalido.style.display = 'none';
        novaSenhaConfirm.style.border = 'none';
        return true;
    }
    // verificar se senhas coincidem
}
function cadastrarUsuario() {
    const verificacaoCampoNome = verificarCampoNome();
    const verificacaoCampoSenha = verificarCampoSenha();
    const verificacaoCampoSenhaConfirm = verificarCampoSenhaConfirm();
    if (verificacaoCampoNome &&
        verificacaoCampoSenha &&
        verificacaoCampoSenhaConfirm) {
        const novoUsuario = {
            usuario: gerarNomeUsuario(),
            senha: novaSenhaConfirm.value,
        };
        let isExiste = false;
        for (usuario of usuarios) {
            if (usuario.usuario === novoUsuario.usuario) {
                isExiste = true;
            }
        }
        if (!isExiste) {
            usuarios.push(novoUsuario);
            salvarDadosServidor();
            sessionStorage.setItem('sessaoAtual', JSON.stringify(novoUsuario));
            location.href = '../usuarioCadastrado.html';
        } else {
            pUsuarioRepetido.style.display = 'block';
        }
    }
}
function buscarUsuariosServidor() {
    let usuarios;
    const dadosServidor = localStorage.getItem('usuarios');
    if ((dadosServidor === null) ||
        (dadosServidor === '')) {
        usuarios = [];
    } else {
        usuarios = JSON.parse(dadosServidor);
    }
    return usuarios;
}
function salvarDadosServidor() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}