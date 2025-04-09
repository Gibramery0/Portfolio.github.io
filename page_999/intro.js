const words = [
    "Seni", "Seviyorum", "Her", "Anımda", "Sen", "Varsın",
    "Sen", "Benim", "Hayatımın", "En", "Güzel", "Şiirisin",
    "Sen", "Benim", "Her", "Şeyimsin", "❤️"
];

const speech = new SpeechSynthesisUtterance();
speech.text = words.join(" ");
speech.lang = "tr-TR";
speech.rate = 1.0;

let currentWordIndex = 0;
let startTime = null;

function clearPreviousWords() {
    document.querySelectorAll('.word.active').forEach(word => {
        word.classList.remove('active');
    });
}

function showWord(index) {
    clearPreviousWords();
    
    const word = document.getElementById(`word${index + 1}`);
    if (!word) return;
    
    word.classList.add('active');
    
    setTimeout(() => {
        word.classList.remove('active');
    }, 1000);
}

speech.onboundary = (event) => {
    if (event.name === 'word') {
        const word = event.utterance.text.substring(event.charIndex, event.charIndex + event.charLength).trim();
        if (words[currentWordIndex] === word) {
            showWord(currentWordIndex);
            currentWordIndex++;
        }
    }
};

speech.onend = () => {
    if (currentWordIndex < words.length) {
        showWord(currentWordIndex);
    }
    
    setTimeout(() => {
        document.querySelectorAll('.word').forEach(word => {
            word.style.opacity = 0;
            word.style.transform = 'scale(0.1)';
        });
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 500);
    }, 1000);
};

window.onload = () => {
    clearPreviousWords();
    
    setTimeout(() => {
        window.speechSynthesis.speak(speech);
    }, 800);
}; 