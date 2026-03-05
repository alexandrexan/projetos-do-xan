const DEFAULT_LANG = 'pt-br';
const FLAG_BY_LANG = {
    'pt-br': { src: 'https://flagcdn.com/br.svg', label: 'PT-BR' },
    en: { src: 'https://flagcdn.com/us.svg', label: 'EN' },
    es: { src: 'https://flagcdn.com/es.svg', label: 'ES' }
};

const state = {
    currentLang: DEFAULT_LANG,
    currentTranslations: {}
};

const selectAll = (selector, context = document) => Array.from(context.querySelectorAll(selector));

document.addEventListener('DOMContentLoaded', iniciarAplicacao);

function iniciarAplicacao() {
    atualizarAnoFooter();
    melhorarAcessibilidadeNav();
    scrollSuaveLinksInternos();
    aplicarLazyLoadingImagens();
    animarCardsProjetos();
    formatarResumoProjetos();
    configurarBandeirasIdioma();
    configurarTrocaIdioma();
    configurarFiltroProjetos();
    configurarModalProjetos();
}

function atualizarAnoFooter() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

function melhorarAcessibilidadeNav() {
    selectAll('nav a').forEach(link => {
        link.addEventListener('focus', () => link.classList.add('focus-visible'));
        link.addEventListener('blur', () => link.classList.remove('focus-visible'));
    });
}

function scrollSuaveLinksInternos() {
    selectAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const targetId = anchor.getAttribute('href');
            const targetElement = targetId ? document.querySelector(targetId) : null;
            if (!targetElement) return;

            event.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function aplicarLazyLoadingImagens() {
    if (!('loading' in HTMLImageElement.prototype)) return;

    selectAll('img').forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
}

function animarCardsProjetos() {
    selectAll('.proj').forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('card-hover'));
        card.addEventListener('mouseleave', () => card.classList.remove('card-hover'));
    });
}

function formatarResumoProjetos() {
    const projectDescriptions = selectAll('.proj p[data-lang-str$="Desc"]');
    const replaceRules = [
        [/\.\s*(Solução:|Solucao:|Solution:|Solución:|Solucion:)/g, '.\n$1'],
        [/\.\s*(Resultado:|Outcome:)/g, '.\n$1']
    ];

    projectDescriptions.forEach(description => {
        const originalText = description.textContent || '';
        let formattedText = originalText.replace(/\s*\n+\s*/g, ' ').trim();

        replaceRules.forEach(([pattern, replacement]) => {
            formattedText = formattedText.replace(pattern, replacement);
        });

        description.textContent = formattedText;
    });
}

function configurarBandeirasIdioma() {
    selectAll('.language-buttons button[data-lang]').forEach(button => {
        const lang = button.dataset.lang;
        const config = lang ? FLAG_BY_LANG[lang] : null;
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
    const languageButtons = selectAll('.language-buttons button[data-lang]');
    const savedLang = localStorage.getItem('preferredLang') || DEFAULT_LANG;

    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.dataset.lang;
            if (lang) {
                loadLanguage(lang);
            }
        });
    });

    loadLanguage(savedLang);
}

function atualizarBotaoIdiomaAtivo(lang) {
    selectAll('.language-buttons button[data-lang]').forEach(button => {
        button.classList.toggle('active', button.dataset.lang === lang);
    });
}

async function loadLanguage(lang) {
    try {
        const response = await fetch(`translations/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Status ${response.status}`);
        }

        const translations = await response.json();
        state.currentLang = lang;
        state.currentTranslations = translations;

        selectAll('[data-lang-str]').forEach(element => {
            const key = element.getAttribute('data-lang-str');
            if (key && translations[key]) {
                element.textContent = translations[key];
            }
        });
        formatarResumoProjetos();

        document.documentElement.lang = lang;
        localStorage.setItem('preferredLang', lang);
        atualizarBotaoIdiomaAtivo(lang);
    } catch (error) {
        console.error('Erro ao carregar idioma:', error);
    }
}

function configurarFiltroProjetos() {
    const filterButtons = selectAll('.filter-btn');
    const projectCards = selectAll('.proj');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            filterButtons.forEach(currentButton => currentButton.classList.remove('active'));
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

    selectAll('[data-details]').forEach(button => {
        button.addEventListener('click', () => {
            const article = button.closest('.proj');
            if (article) {
                abrirModalProjeto(article);
            }
        });
    });

    if (closeButton) {
        closeButton.addEventListener('click', fecharModalProjeto);
    }

    if (modal) {
        modal.addEventListener('click', event => {
            if (event.target === modal) {
                fecharModalProjeto();
            }
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
    const title = state.currentTranslations[`${projectId}Name`] || '';
    const description = state.currentTranslations[`${projectId}Desc`] || '';
    const highlights = [1, 2, 3]
        .map(index => state.currentTranslations[`${projectId}Detail${index}`])
        .filter(Boolean);

    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalHighlights = document.getElementById('modal-highlights');
    const modalDemo = document.getElementById('modal-demo');
    const modalCode = document.getElementById('modal-code');

    if (modalTitle) {
        modalTitle.textContent = title;
    }
    if (modalDescription) {
        modalDescription.textContent = description;
    }

    if (modalHighlights) {
        modalHighlights.innerHTML = '';
        highlights.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            modalHighlights.appendChild(listItem);
        });
    }

    const anchors = selectAll('a', article);
    if (modalDemo && anchors[0]) {
        modalDemo.href = anchors[0].href;
    }
    if (modalCode && anchors[1]) {
        modalCode.href = anchors[1].href;
    }

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
