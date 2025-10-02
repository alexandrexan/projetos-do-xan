// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    atualizarAnoFooter();
    melhorarAcessibilidadeNav();
    scrollSuaveLinksInternos();
    aplicarLazyLoadingImagens();
    animarCardsProjetos();
});

// Atualiza o ano no footer
function atualizarAnoFooter() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

// Acessibilidade na navegação
function melhorarAcessibilidadeNav() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('focus', () => link.classList.add('focus-visible'));
        link.addEventListener('blur', () => link.classList.remove('focus-visible'));
    });
}

// Scroll suave
function scrollSuaveLinksInternos() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Lazy loading
function aplicarLazyLoadingImagens() {
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img').forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    }
}

// Animação nos cards de projetos
function animarCardsProjetos() {
    document.querySelectorAll('.proj').forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('card-hover'));
        card.addEventListener('mouseleave', () => card.classList.remove('card-hover'));
    });
}