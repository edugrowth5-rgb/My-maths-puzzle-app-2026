// 1. Game Variables
let score = 0;
let level = 1;
let pointsToNextLevel = 50;
let timeLeft = 30;
let correctAnswer;
let timer;

// 2. Clean Theme Colors (10 Attractive Colors)
const colors = [
    { bg: "#FFDE59", accent: "#8C52FF" }, // Yellow
    { bg: "#FF914D", accent: "#333333" }, // Orange
    { bg: "#7ED957", accent: "#2D5A27" }, // Green
    { bg: "#5271FF", accent: "#FFFFFF" }, // Blue
    { bg: "#FF5757", accent: "#FFFF00" }, // Red
    { bg: "#FF66C4", accent: "#333333" }, // Pink
    { bg: "#8C52FF", accent: "#00FFD1" }, // Purple
    { bg: "#00D2FF", accent: "#003366" }, // Sky
    { bg: "#B5FFD9", accent: "#FF5757" }, // Mint
    { bg: "#2d3436", accent: "#7ED957" }  // Dark Mode
];

// 3. Setup Theme Dots (Interface Adjust karne ke liye)
function setupThemes() {
    const selector = document.getElementById('theme-selector');
    if (!selector) return;
    selector.innerHTML = ''; 
    colors.forEach(color => {
        const dot = document.createElement('div');
        dot.className = 'theme-dot';
        dot.style.backgroundColor = color.bg;
        dot.onclick = () => {
            // Poore interface ka background aur theme badlega
            document.documentElement.style.setProperty('--bg-color', color.bg);
            document.documentElement.style.setProperty('--accent-color', color.accent);
        };
        selector.appendChild(dot);
    });
}

// 4. Generate Maths Puzzle (Dynamic Difficulty ke saath)
function generatePuzzle() {
    const max = 5 + (level * 2);
    const n1 = Math.floor(Math.random() * max) + 1;
    const n2 = Math.floor(Math.random() * max) + 1;
    
    // Level 3 ke baad minus (-) bhi aayega
    const operator = (level > 2 && Math.random() > 0.5) ? '-' : '+';
    let val1, val2, res;

    if (operator === '-') {
        val1 = n1 + n2;
        val2 = n1;
        res = n2;
    } else {
        val1 = n1;
        val2 = n2;
        res = n1 + n2;
    }

    // Randomly ek jagah '?' daalna
    const hole = Math.floor(Math.random() * 3);
    document.getElementById('num1').textContent = hole === 0 ? '?' : val1;
    document.getElementById('operator').textContent = operator;
    document.getElementById('num2').textContent = hole === 1 ? '?' : val2;
    document.getElementById('result').textContent = hole === 2 ? '?' : res;

    correctAnswer = hole === 0 ? val1 : (hole === 1 ? val2 : res);
    renderOptions(correctAnswer, max * 2);
}

// 5. Render Buttons (Clean & Visible Numbers ke saath)
function renderOptions(correct, limit) {
    const container = document.getElementById('options');
    if (!container) return;
    container.innerHTML = '';
    let choices = [correct];
    
    while(choices.length < 4) {
        let wrong = Math.floor(Math.random() * (limit + 15)) + 1;
        if(!choices.includes(wrong)) choices.push(wrong);
    }
    
    // Shuffle karke buttons banana
    choices.sort(() => Math.random() - 0.5).forEach(val => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = val;
        
        // VISIBILITY FIX: Buttons ko hamesha white aur text black rakha hai
        btn.style.color = "#333333";
        btn.style.backgroundColor = "#ffffff";

        btn.onclick = () => checkAnswer(val, btn);
        container.appendChild(btn);
    });
}

// 6. Check Answer (Points aur Level Up logic)
function checkAnswer(val, btn) {
    if(val === correctAnswer) {
        score += 10;
        document.getElementById('score').textContent = "⭐ " + score;
        
        // Progress Bar Update
        let progress = (score % pointsToNextLevel) / pointsToNextLevel * 100;
        const fill = document.getElementById('progress-fill');
        if(fill) {
            fill.style.width = (progress === 0 ? 100 : progress) + "%";
        }
        
        // Level Up check
        if(score % pointsToNextLevel === 0) {
            level++;
            document.getElementById('level-val').textContent = level;
            timeLeft += 5; // Bonus time for level up
        }
        
        btn.style.backgroundColor = "#7ED957"; // Correct Green
        btn.style.color = "#fff";
        setTimeout(generatePuzzle, 300);
    } else {
        // Galat hone par red flash
        btn.style.backgroundColor = "#FF5757"; 
        btn.style.color = "#fff";
        setTimeout(() => {
            btn.style.backgroundColor = "#fff";
            btn.style.color = "#333";
        }, 400);
    }
}

// 7. Start Game Function
function startGame() {
    // Resetting game state
    score = 0; 
    level = 1; 
    timeLeft = 30;
    
    document.getElementById('score').textContent = "⭐ 0";
    document.getElementById('level-val').textContent = "1";
    document.getElementById('timer').textContent = "⏰ 30s";
    
    const fill = document.getElementById('progress-fill');
    if(fill) fill.style.width = "0%";
    
    // Game UI update
    const startBtn = document.getElementById('start-btn');
    if(startBtn) startBtn.style.display = 'none';
    
    generatePuzzle();
    
    // Timer Logic
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        const timerDisplay = document.getElementById('timer');
        if(timerDisplay) timerDisplay.textContent = "⏰ " + timeLeft + "s";
        
        if(timeLeft <= 0) {
            clearInterval(timer);
            alert("Game Over! Score: " + score);
            if(startBtn) {
                startBtn.style.display = 'block';
                startBtn.textContent = "Play Again 🔄";
            }
        }
    }, 1000);
}

// 8. Initializing event listeners aur theme setup
const mainStartBtn = document.getElementById('start-btn');
if(mainStartBtn) {
    mainStartBtn.addEventListener('click', startGame);
}

// Run setup on load
setupThemes();
// Mapp.js ke sabse neeche add karein

let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    // Browser ka default prompt rokein
    e.preventDefault();
    // Event ko save karein taaki baad mein trigger kar sakein
    deferredPrompt = e;
    // Install button ko dikha dein
    if (installBtn) {
        installBtn.style.display = 'block';
    }
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            // Install prompt dikhayein
            deferredPrompt.prompt();
            // User ka choice check karein
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to install: ${outcome}`);
            // Prompt ko clear karein
            deferredPrompt = null;
            // Button ko phir se chhupa dein
            installBtn.style.display = 'none';
        }
    });
}

// Agar app pehle se installed hai toh button hide rakhein
window.addEventListener('appinstalled', () => {
    console.log('Maths Magic App Installed Successfully! 🎉');
    if (installBtn) {
        installBtn.style.display = 'none';
    }
});
