let currentLang = 'pt-br';
let currentTranslations = {};

document.addEventListener('DOMContentLoaded', () => {
    atualizarAnoFooter();
    melhorarAcessibilidadeNav();
    scrollSuaveLinksInternos();
    aplicarLazyLoadingImagens();
    animarCardsProjetos();
    configurarBandeirasIdioma();
    configurarTrocaIdioma();
    configurarFiltroProjetos();
    configurarModalProjetos();
});

function atualizarAnoFooter() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function melhorarAcessibilidadeNav() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('focus', () => link.classList.add('focus-visible'));
        link.addEventListener('blur', () => link.classList.remove('focus-visible'));
    });
}

function scrollSuaveLinksInternos() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function aplicarLazyLoadingImagens() {
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img').forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    }
}

function animarCardsProjetos() {
    document.querySelectorAll('.proj').forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('card-hover'));
        card.addEventListener('mouseleave', () => card.classList.remove('card-hover'));
    });
}

function configurarBandeirasIdioma() {
    const flagByLang = {
        'pt-br': { src: 'https://flagcdn.com/br.svg', label: 'PT-BR' },
        en: { src: 'https://flagcdn.com/us.svg', label: 'EN' },
        es: { src: 'https://flagcdn.com/es.svg', label: 'ES' }
    };

    document.querySelectorAll('.language-buttons button[data-lang]').forEach(button => {
        const lang = button.dataset.lang;
        const config = flagByLang[lang];
        if (!config || button.querySelector('.lang-flag')) return;

        const currentLabel = (button.textContent || '').trim() || config.label;

        button.setAttribute('aria-label', currentLabel);
        button.textContent = '';

        const flag = document.createElement('img');
        flag.className = 'lang-flag';
        flag.src = config.src;
        flag.width = 18;
        flag.height = 14;
        flag.alt = '';
        flag.decoding = 'async';
        flag.setAttribute('aria-hidden', 'true');

        const label = document.createElement('span');
        label.textContent = currentLabel;

        button.append(flag, label);
    });
}

function configurarTrocaIdioma() {
    const languageButtons = document.querySelectorAll('.language-buttons button[data-lang]');
    const savedLang = localStorage.getItem('preferredLang') || 'pt-br';

    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.dataset.lang;
            if (lang) loadLanguage(lang);
        });
    });

    loadLanguage(savedLang);
}

function atualizarBotaoIdiomaAtivo(lang) {
    document.querySelectorAll('.language-buttons button[data-lang]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

async function loadLanguage(lang) {
    try {
        const res = await fetch(`translations/${lang}.json`);
        if (!res.ok) throw new Error(`Status ${res.status}`);

        const translations = await res.json();
        currentLang = lang;
        currentTranslations = translations;

        document.querySelectorAll('[data-lang-str]').forEach(el => {
            const key = el.getAttribute('data-lang-str');
            if (translations[key]) el.textContent = translations[key];
        });

        document.documentElement.lang = lang;
        localStorage.setItem('preferredLang', lang);
        atualizarBotaoIdiomaAtivo(lang);
    } catch (err) {
        console.error('Erro ao carregar idioma:', err);
    }
}

function configurarFiltroProjetos() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.proj');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            projectCards.forEach(card => {
                const techList = (card.dataset.tech || '').split(' ');
                const showCard = filter === 'all' || techList.includes(filter);
                card.hidden = !showCard;
            });
        });
    });
}

function configurarModalProjetos() {
    const modal = document.getElementById('project-modal');
    const closeButton = document.getElementById('modal-close');
    const detailButtons = document.querySelectorAll('[data-details]');

    detailButtons.forEach(button => {
        button.addEventListener('click', () => {
            const article = button.closest('.proj');
            if (!article) return;
            abrirModalProjeto(article);
        });
    });

    if (closeButton) {
        closeButton.addEventListener('click', fecharModalProjeto);
    }

    if (modal) {
        modal.addEventListener('click', event => {
            if (event.target === modal) fecharModalProjeto();
        });
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal && modal.classList.contains('open')) {
            fecharModalProjeto();
        }
    });
}

function abrirModalProjeto(article) {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const projectId = article.dataset.project;
    const title = currentTranslations[`${projectId}Name`] || '';
    const description = currentTranslations[`${projectId}Desc`] || '';

    const highlights = [
        currentTranslations[`${projectId}Detail1`],
        currentTranslations[`${projectId}Detail2`],
        currentTranslations[`${projectId}Detail3`]
    ].filter(Boolean);

    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalHighlights = document.getElementById('modal-highlights');
    const modalDemo = document.getElementById('modal-demo');
    const modalCode = document.getElementById('modal-code');

    if (modalTitle) modalTitle.textContent = title;
    if (modalDescription) modalDescription.textContent = description;

    if (modalHighlights) {
        modalHighlights.innerHTML = '';
        highlights.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            modalHighlights.appendChild(li);
        });
    }

    const anchors = article.querySelectorAll('a');
    if (modalDemo && anchors[0]) modalDemo.href = anchors[0].href;
    if (modalCode && anchors[1]) modalCode.href = anchors[1].href;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
}

function fecharModalProjeto() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
}
