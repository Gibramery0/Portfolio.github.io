const username = "Gibramery0"; 
const projectsContainer = document.getElementById("projects-container");
const loadingAnimation = document.getElementById("loading-animation");

// Örnek projeler - API hata verdiğinde gösterilecek
const sampleProjects = [
    {
        name: "Lazer Güvenlik Sistemi",
        description: "Arduino kullanarak oluşturulan lazer tabanlı güvenlik sistemi",
        image: "src/images/lasersecurity.jpg" 
    },
    {
        name: "Güneş Takip Sistemi",
        description: "Güneş panellerinin verimini artırmak için güneşi takip eden sistem",
        image: "src/images/gunestakip.jpg"
    },
    {
        name: "Meyve Piyano",
        description: "Meyveler ile kontrol edilebilen interaktif müzik projesi",
        image: "src/images/fruitpiano.jpg"
    }
];

// Sayfa yüklendikten sonra projeleri getirme işlemini başlat
window.addEventListener('DOMContentLoaded', function() {
    fetchRepositories();
});

// Projeleri yükleme fonksiyonu
async function fetchRepositories() {
    try {
        console.log(`GitHub projelerini getirme işlemi başlatıldı: ${username}`);
        
        // GitHub API isteği
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        
        if (!response.ok) {
            throw new Error(`GitHub API yanıt vermedi: ${response.status} ${response.statusText}`);
        }
        
        const repositories = await response.json();
        console.log(`${repositories.length} proje bulundu`);

        if (repositories.length === 0) {
            projectsContainer.innerHTML = `<div class="col-span-3 text-center py-10">
                <p class="text-blue-500">Bu GitHub hesabında henüz proje bulunmuyor.</p>
            </div>`;
            
            // Yükleme animasyonunu gizle
            if (loadingAnimation) {
                loadingAnimation.style.display = "none";
            }
            return;
        }

        // Boşlukları kaldırmak için container'ın gap özelliğini kaldır
        projectsContainer.classList.remove("gap-5");
        projectsContainer.classList.add("gap-0");
        
        // Arka plan rengini ekle
        document.querySelector('#projects').classList.add('bg-gray-100');

        projectsContainer.innerHTML = ""; 

        // Projeleri yükle ve animasyonla göster
        repositories.forEach(async (repo, index) => {
            // "-" ve "_" karakterlerini boşlukla değiştir
            const projectName = repo.name.replace(/[-_]/g, ' ');
            const projectUrl = repo.html_url;
            const projectDescription = repo.description; 
            console.log(`Proje yükleniyor: ${projectName}`);
            
            // Proje kartını oluştur ve ekle
            createProjectCard(projectName, projectUrl, projectDescription, index, repo.name);
        });
    } catch (error) {
        console.error("Projeler alınırken hata oluştu:", error);
        
        // Yükleme animasyonunu gizle
        if (loadingAnimation) {
            loadingAnimation.style.display = "none";
        }
        
        // Hata mesajını göster, ancak kullanıcı dostu bir mesaj
        projectsContainer.innerHTML = `<div class="col-span-3 text-center py-10">
            <p class="text-blue-500">GitHub projelerini şu anda yükleyemiyoruz. Lütfen daha sonra tekrar deneyin.</p>
            <button onclick="retryFetchRepositories()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Yeniden Dene</button>
        </div>`;
    }
}

// Örnek projeleri yükleme fonksiyonu
function loadSampleProjects() {
    // Boşlukları kaldırmak için container'ın gap özelliğini kaldır
    projectsContainer.classList.remove("gap-5");
    projectsContainer.classList.add("gap-0");
    
    // Arka plan rengini ekle
    document.querySelector('#projects').classList.add('bg-gray-100');
    
    projectsContainer.innerHTML = "";
    
    // Örnek projeleri göster
    sampleProjects.forEach((project, index) => {
        createProjectCard(project.name, "#", project.description, index, null, project.image);
    });
    
    // Yükleme animasyonunu 1 saniye sonra gizle
    setTimeout(() => {
        if (loadingAnimation) {
            loadingAnimation.style.display = "none";
        }
    }, 1000);
}

// Proje kartı oluşturma fonksiyonu
function createProjectCard(projectName, projectUrl, projectDescription, index, repoName) {
    const projectCard = document.createElement("div");
    projectCard.className = "p-0 cursor-pointer transform hover:scale-105 transition-all opacity-0 relative bg-gray-100";
    projectCard.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
    
    // Önce Font Awesome fotoğraf ikonu ile göster
    let cardContent = `
        <a href="${projectUrl}" target="_blank" class="block">
            <div class="relative overflow-visible">
                <div class="w-full h-60 bg-gray-200 flex items-center justify-center image-container group" data-repo="${repoName}">
                    <i class="fa-solid fa-image fa-5x text-gray-400"></i>
                </div>
                <div class="absolute -bottom-5 left-0 right-0 z-10">
                    <div class="bg-white mx-auto w-4/5 py-2 px-4 rounded-full shadow-lg text-center border border-gray-200">
                        <p class="text-lg font-semibold text-blue-700 truncate">${projectName}</p>
                    </div>
                </div>
            </div>`;
    
    // Açıklama varsa ekle (boş açıklama gösterme)
    if (projectDescription) {
        cardContent += `
            <div class="bg-gray-100 p-5 pt-10">
                <p class="text-sm text-gray-600 text-center mt-4">${projectDescription}</p>
            </div>`;
    } else {
        cardContent += `
            <div class="bg-gray-100 p-5 pt-10">
                <!-- Boş açıklama alanı -->
            </div>`;
    }
    
    cardContent += `</a>`;
    
    projectCard.innerHTML = cardContent;
    projectsContainer.appendChild(projectCard);
    
    // Resmi yükle
    loadProjectImage(repoName, projectCard.querySelector('.image-container'));
}

// Proje resmi yükleme fonksiyonu
async function loadProjectImage(repoName, imageContainer) {
    try {
        const projectImage = await getProjectImage(username, repoName);
        
        if (projectImage !== "src/images/default.jpg") {
            // Resim yüklendiyse arka plana ekle
            const img = new Image();
            img.onload = function() {
                imageContainer.innerHTML = '';
                imageContainer.style.backgroundImage = `url('${projectImage}')`;
                imageContainer.style.backgroundSize = 'cover';
                imageContainer.style.backgroundPosition = 'center';
                
                // Expand butonunu ekle
                const expandBtn = document.createElement('button');
                expandBtn.className = 'expand-btn absolute top-2 right-2 bg-white bg-opacity-40 p-2 rounded-full shadow-lg hover:bg-opacity-60 transition-all z-[100]';
                expandBtn.innerHTML = '<i class="fa-solid fa-expand text-gray-700 text-lg"></i>';
                
                // Büyütme/küçültme işlevselliği
                expandBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Modal oluştur
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[1000]';
                    
                    // Modal içeriği
                    const modalContent = document.createElement('div');
                    modalContent.className = 'relative max-w-4xl w-full mx-4';
                    
                    // Kapatma butonu
                    const closeBtn = document.createElement('button');
                    closeBtn.className = 'absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors';
                    closeBtn.innerHTML = '<i class="fa-solid fa-xmark text-3xl"></i>';
                    
                    // Görsel container
                    const imageWrapper = document.createElement('div');
                    imageWrapper.className = 'bg-white rounded-lg overflow-hidden';
                    
                    // Görsel
                    const modalImg = document.createElement('img');
                    modalImg.className = 'w-full h-auto';
                    modalImg.src = projectImage;
                    modalImg.alt = repoName.replace(/[-_]/g, ' '); // Proje adını düzgün formatta göster
                    
                    // Modal içeriğini birleştir
                    imageWrapper.appendChild(modalImg);
                    modalContent.appendChild(closeBtn);
                    modalContent.appendChild(imageWrapper);
                    modal.appendChild(modalContent);
                    
                    // Modalı sayfaya ekle
                    document.body.appendChild(modal);
                    
                    // Kapatma işlevi
                    closeBtn.addEventListener('click', () => {
                        modal.remove();
                    });
                    
                    // Modal dışına tıklayınca kapat
                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            modal.remove();
                        }
                    });
                });
                
                imageContainer.appendChild(expandBtn);
            };
            img.onerror = function() {
                // Resim yüklenemezse ikonu koru
                console.warn(`${repoName} için resim yüklenemedi: ${projectImage}`);
            };
            img.src = projectImage;
        }
    } catch (error) {
        console.warn(`${repoName} için resim yüklenemedi:`, error);
    }
}

// GitHub'dan proje resmi alma fonksiyonu
async function getProjectImage(username, repoName) {
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/`);
        
        if (!response.ok) {
            throw new Error(`Repository içeriği alınamadı: ${response.status}`);
        }
        
        const files = await response.json();

        // Sadece project.img, project.jpg, project.png dosyalarını ara
        const imageFile = files.find(file => 
            file.name.toLowerCase() === "project.img" || 
            file.name.toLowerCase() === "project.jpg" || 
            file.name.toLowerCase() === "project.png"
        );
        
        return imageFile ? imageFile.download_url : "src/images/default.jpg";
    } catch (error) {
        console.warn(`${repoName} için içerik yüklenemedi:`, error);
        return "src/images/default.jpg";
    }
}

// Yeniden deneme fonksiyonu
function retryFetchRepositories() {
    if (loadingAnimation) {
        loadingAnimation.style.display = "flex";
    }
fetchRepositories();
}

// CSS Animasyonu ekle
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .image-container {
        transition: all 0.3s ease;
        background-size: cover;
        background-position: center;
        position: relative;
    }

    .expand-btn {
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 100;
    }

    .image-container:hover .expand-btn {
        opacity: 1;
    }
`;
document.head.appendChild(style);
