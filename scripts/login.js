// Elementos do DOM
const pCredenciaisInvalidas = document.getElementById('erro');
const nomeUsuario = document.getElementById('nome-usuario');
const pNomeUsuarioVazio = document.getElementById('nome-usuario-vazia');
const senhaUsuario = document.getElementById('senha-usuario');
const pSenhaUsuarioVazio = document.getElementById('senha-usuario-vazia');
const btnSubmit = document.getElementById('btn-submit');
const entrarAnonymous = document.getElementById('entrar-anonymous');

// Variáveis globais e Listeners
var usuarios = [];

nomeUsuario.addEventListener('keyup', verificarCampoNome);
senhaUsuario.addEventListener('keyup', verificarCampoSenha);
btnSubmit.addEventListener('click', fazerLogin);
entrarAnonymous.addEventListener('click', fazerLoginAnonymous);

// Functions
window.onload = () => {
    usuarios = buscarUsuariosServidor();
}
function verificarCampoNome() {
    if (nomeUsuario.value === '') {
        pNomeUsuarioVazio.style.display = 'block';
        return false;
    } else {
        pNomeUsuarioVazio.style.display = 'none';
        return true;
    }
}
function verificarCampoSenha() {
    if (senhaUsuario.value === '') {
        pSenhaUsuarioVazio.style.display = 'block';
        return false;
    } else {
        pSenhaUsuarioVazio.style.display = 'none';
        return true;
    }
}
function validarCredenciais(usuarioInformado, senhaInformada) {
    for (let usuario of usuarios) {
        if ((usuario.nome === usuarioInformado) &&
            (usuario.senha === senhaInformada)) {
            return true;
        }
    }
    return false;
}
function fazerLogin() {
    const verificacaoNomeUsuario = verificarCampoNome();
    const verificacaoSenhaUsuario = verificarCampoSenha();
    if (verificacaoNomeUsuario && verificacaoSenhaUsuario) {
        const validacaoCredenciais = validarCredenciais(nomeUsuario.value, senhaUsuario.value);
        if (validacaoCredenciais) {
            const sessaoAtual = {
                usuario: nomeUsuario.value,
                senha: senhaUsuario.value,
            };
            sessionStorage.setItem('sessaoAtual', JSON.stringify(sessaoAtual));
            location.href = '../app.html';
        } else {
            pCredenciaisInvalidas.style.display = 'block';
        }
    }
}
function fazerLoginAnonymous() {
    const sessaoAtual = {
        usuario: 'Anonymous',
        senha: '',
    };
    sessionStorage.setItem('sessaoAtual', JSON.stringify(sessaoAtual));
    location.href = '../app.html';
}
function buscarUsuariosServidor() {
    let usuarios;
    const dadosServidor = localStorage.getItem('usuarios');
    if ((dadosServidor === null) ||
        (dadosServidor === '')) {
        usuarios = [];
    } else {
        usuarios = dadosServidor;
    }
    return usuarios;
}