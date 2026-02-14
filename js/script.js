const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const questionCard = document.getElementById('question-card');
const successMessage = document.getElementById('success-message');

// Funzione per muovere il bottone No
noBtn.addEventListener('mouseover', () => {
    // Calcola i limiti dello schermo meno la dimensione del bottone
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

    noBtn.style.position = 'absolute';
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
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