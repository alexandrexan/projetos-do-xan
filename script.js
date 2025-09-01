// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Atualiza o ano no footer dinamicamente
    document.getElementById('year').textContent = new Date().getFullYear();

    // Melhoria de acessibilidade para navegação
    const nav = document.querySelector('nav');
    const links = nav.getElementsByTagName('a');
    
    // Adiciona indicadores de foco para navegação por teclado
    Array.from(links).forEach(link => {
        link.addEventListener('focus', () => {
            link.style.outline = '2px solid var(--accent)';
            link.style.outlineOffset = '4px';
        });
        
        link.addEventListener('blur', () => {
            link.style.outline = 'none';
        });
    });

    // Scroll suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Lazy loading para imagens
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    }

    // Animação simples para cards de projetos
    const projCards = document.querySelectorAll('.proj');
    projCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});