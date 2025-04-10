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

document.getElementById('startButton').addEventListener('click', function() {
    // "Sana güzel bir mesajım var :)" metnini ve butonu gizle
    document.getElementById('message').classList.add('hide');
    document.getElementById('startButton').classList.add('hide');

    // Speech synthesis işlemi
    window.speechSynthesis.speak(speech);
    
    // Mesajları sırayla gösterme
    speech.onboundary = (event) => {
        if (event.name === 'word') {
            const word = event.utterance.text.substring(event.charIndex, event.charIndex + event.charLength).trim();
            if (words[currentWordIndex] === word) {
                const wordElement = document.getElementById(`word${currentWordIndex + 1}`);
                if (wordElement) {
                    wordElement.classList.add('active');
                }
                currentWordIndex++;
            }
        }
    };
});
