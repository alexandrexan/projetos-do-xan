// small JS: dynamic year + basic accessibility focus management
document.getElementById('year').textContent = new Date().getFullYear();

// progressive enhancement: keyboard focus visible already via CSS :focus
// lazy-loading images example: add loading="lazy" to <img> tags where used