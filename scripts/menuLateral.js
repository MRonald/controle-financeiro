// Elementos do DOM
const hamburgerIcon = document.getElementById('hamburguer-icon');
const bgMenuLateral = document.getElementById('bg-menu-lateral');
const iconeFecharMenuLateral = document.getElementById('icone-fechar');

// Variáveis globais e Listeners
hamburgerIcon.addEventListener('click', abrirMenuLateral);
bgMenuLateral.addEventListener('click', fecharMenuLateral);
iconeFecharMenuLateral.addEventListener('click', fecharMenuLateral);

// Funções
function abrirMenuLateral() {
    bgMenuLateral.classList.remove('esconder');
}
function fecharMenuLateral() {
    bgMenuLateral.classList.add('esconder');
}