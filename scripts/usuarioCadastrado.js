// Elementos do DOM
const spanTituloBoasVindas = document.getElementById('msg-boas-vindas');
const spanPNomeUsuario = document.getElementById('msg-nome-usuario');

// Variáveis globais
var usuarioAtual;
var primeiroNomeUsuario

// Functions
window.onload = () => {
    usuarioAtual = JSON.parse(sessionStorage.getItem('sessaoAtual'));
    usuarioAtual = usuarioAtual.usuario;
    primeiroNomeUsuario = capitalizar(usuarioAtual.split('_')[0]);
    spanTituloBoasVindas.innerText = primeiroNomeUsuario;
    spanPNomeUsuario.innerText = usuarioAtual;
}
function capitalizar(texto) {
    const primeiraLetra = texto[0];
    const resto = texto.substring(1)
    return primeiraLetra.toUpperCase() + resto;
}