const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const questionCard = document.getElementById('question-card');
const successMessage = document.getElementById('success-message');

// Funzioni di posizionamento sicuro per il bottone No
function rectsOverlap(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

function moveNoTo(x, y) {
    noBtn.style.position = 'absolute';
    noBtn.style.left = `${Math.max(8, Math.min(x, window.innerWidth - noBtn.offsetWidth - 8))}px`;
    noBtn.style.top = `${Math.max(8, Math.min(y, window.innerHeight - noBtn.offsetHeight - 8))}px`;
}

function moveNoAwayFromAvoidRect(avoidRect) {
    const btnW = noBtn.offsetWidth || noBtn.getBoundingClientRect().width;
    const btnH = noBtn.offsetHeight || noBtn.getBoundingClientRect().height;
    let tries = 0;
    while (tries < 30) {
        const x = Math.random() * (window.innerWidth - btnW - 16) + 8;
        const y = Math.random() * (window.innerHeight - btnH - 16) + 8;
        const candidate = { left: x, top: y, right: x + btnW, bottom: y + btnH };
        if (!rectsOverlap(candidate, avoidRect)) {
            moveNoTo(x, y);
            return;
        }
        tries++;
    }
    // Fallback: push to top-right corner
    moveNoTo(window.innerWidth - btnW - 16, 16);
}

function moveNoToRandomAvoidingYes() {
    const yesRect = yesBtn.getBoundingClientRect();
    moveNoAwayFromAvoidRect({ left: yesRect.left - 12, top: yesRect.top - 12, right: yesRect.right + 12, bottom: yesRect.bottom + 12 });
}

// Use pointer events for desktop (non-touch) and touchstart for mobile
noBtn.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'touch') return;
    moveNoToRandomAvoidingYes();
});

noBtn.addEventListener('touchstart', (e) => {
    // Prevent the immediate click on touch; move the button away from the touch point
    e.preventDefault();
    const t = e.touches[0];
    const avoidRect = { left: t.clientX - 40, top: t.clientY - 40, right: t.clientX + 40, bottom: t.clientY + 40 };
    moveNoAwayFromAvoidRect(avoidRect);
});

// Azione al click sul pulsante Sì
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerText = '❤';

    // Adjust size for mobile vs desktop
    const isMobile = window.innerWidth <= 480 || /Mobi|Android/i.test(navigator.userAgent);
    const size = isMobile
        ? Math.floor(Math.random() * 14) + 14 // 14-28px on mobile
        : Math.floor(Math.random() * 28) + 20; // 20-48px on desktop
    heart.style.fontSize = `${size}px`;

    // Position in px to avoid overflow at edges
    const leftPx = Math.random() * Math.max(0, window.innerWidth - size);
    heart.style.left = `${leftPx}px`;

    // Random animation duration
    const duration = isMobile ? (Math.random() * 2) + 3 : (Math.random() * 3) + 3; // mobile slightly faster
    heart.style.animationDuration = `${duration}s`;

    document.body.appendChild(heart);

    // Remove after animation
    heart.addEventListener('animationend', () => heart.remove());
}

function startHeartRain(durationMs = 4000, intervalMs = 100) {
    // Adjust density on mobile to reduce occlusion and CPU
    const isMobile = window.innerWidth <= 480 || /Mobi|Android/i.test(navigator.userAgent);
    const actualInterval = isMobile ? Math.max(intervalMs, 120) : intervalMs;
    const actualDuration = isMobile ? Math.max(durationMs - 1000, 2500) : durationMs;

    const iv = setInterval(createHeart, actualInterval);
    setTimeout(() => clearInterval(iv), actualDuration);
}

yesBtn.addEventListener('click', () => {
    questionCard.classList.add('hidden');
    successMessage.classList.remove('hidden');
    startHeartRain(4500, 90);
});