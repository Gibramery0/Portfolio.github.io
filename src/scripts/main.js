document.addEventListener("DOMContentLoaded", function () {
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "scale(1.1) translateY(-10px) rotate(2deg)";
            card.style.transition = "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out";
            card.style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.2)";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "scale(1) translateY(0) rotate(0deg)";
            card.style.boxShadow = "none";
        });
    });

    // Scroll ile belirme efekti
    const revealProjects = () => {
        projectCards.forEach((card) => {
            const cardPosition = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (cardPosition < windowHeight - 50) {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
                card.style.transition = "opacity 0.6s ease-out !important, transform 0.6s ease-out !important";
            }
        });
    };

    // Başlangıçta tüm kartları gizle
    projectCards.forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    });

    window.addEventListener("scroll", revealProjects);
    setTimeout(revealProjects, 100); // Yükleme sonrası tetikleme
});