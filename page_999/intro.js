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
                window.location.href = 'index.html';  // Burada yönlendirme yapılır.
            }, 500);  // 500 ms bekleme süresi.
        }, 1000);  // 1 saniye sonra animasyonun bitişi sonrası yapılacak işlemler.
    };
    
});
