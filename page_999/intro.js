// Kalp emoji'sinin HTML elementini seçiyoruz
const heartButton = document.getElementById('heartButton');

// Metinleri tanımlıyoruz
const words = [
    "Seni", "Seviyorum", "Her", "Anımda", "Sen", "Varsın",
    "Sen", "Benim", "Hayatımın", "En", "Güzel", "Şiirisin",
    "Sen", "Benim", "Her", "Şeyimsin", "❤️"
];

// Sesle metin okuma için SpeechSynthesisUtterance oluşturuyoruz
const speech = new SpeechSynthesisUtterance();
speech.text = words.join(" ");
speech.lang = "tr-TR";
speech.rate = 1.0;

let currentWordIndex = 0;

// Önceki kelimeleri temizleme fonksiyonu
function clearPreviousWords() {
    document.querySelectorAll('.word.active').forEach(word => {
        word.classList.remove('active');
    });
}

// Yeni kelimeyi gösteren fonksiyon
function showWord(index) {
    clearPreviousWords();
    
    const word = document.getElementById(`word${index + 1}`);
    if (!word) return;
    
    word.classList.add('active');
    
    setTimeout(() => {
        word.classList.remove('active');
    }, 1000);
}

// Kelime sınırına ulaşıldığında sesin ilerlemesi için event handler
speech.onboundary = (event) => {
    if (event.name === 'word') {
        const word = event.utterance.text.substring(event.charIndex, event.charIndex + event.charLength).trim();
        if (words[currentWordIndex] === word) {
            showWord(currentWordIndex);
            currentWordIndex++;
        }
    }
};

// Ses bitince yapılacak işlemler
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
            window.location.href = 'index.html';  // Sayfayı yönlendiriyoruz
        }, 500);
    }, 1000);
};

// Kullanıcı etkileşimi ile sesi başlatıyoruz
heartButton.addEventListener('click', () => {
    // Kalp simgesinin kaybolmasını sağlamak için animasyon ekliyoruz
    heartButton.classList.add('hide'); // Kaybolma animasyonu başlatılır

    // Kelimeleri gösterme
    clearPreviousWords();
    
    setTimeout(() => {
        window.speechSynthesis.speak(speech);  // Sesin başlaması
    }, 800);  // 0.8 saniye gecikme ile sesi başlatıyoruz
});
