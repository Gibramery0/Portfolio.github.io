const username = "Gibramery0"; 
const projectsContainer = document.getElementById("projects-container");
const loadingAnimation = document.getElementById("loading-animation");

async function fetchRepositories() {
    try {
        console.log(`GitHub projelerini getirme işlemi başlatıldı: ${username}`);
        
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        
        if (!response.ok) {
            throw new Error(`GitHub API yanıt vermedi: ${response.status} ${response.statusText}`);
        }
        
        const repositories = await response.json();
        console.log(`${repositories.length} proje bulundu`);

        // Projelerin yüklenmesi bittikten sonra yükleme animasyonunu gizle
        if (loadingAnimation) {
            loadingAnimation.style.display = "none";
        }

        if (repositories.length === 0) {
            projectsContainer.innerHTML = `<div class="col-span-3 text-center py-10">
                <p class="text-blue-500">Bu GitHub hesabında henüz proje bulunmuyor.</p>
            </div>`;
            return;
        }

        // Boşlukları kaldırmak için container'ın gap özelliğini kaldır
        projectsContainer.classList.remove("gap-5");
        projectsContainer.classList.add("gap-0");
        
        projectsContainer.innerHTML = ""; 

        // Projeleri yükle ve animasyonla göster
        repositories.forEach(async (repo, index) => {
            const projectName = repo.name;
            const projectUrl = repo.html_url;
            const projectDescription = repo.description; // "Açıklama bulunmuyor" yedeği yok
            console.log(`Proje yükleniyor: ${projectName}`);
            
            try {
                const projectImage = await getProjectImage(username, projectName);

                const projectCard = document.createElement("div");
                projectCard.className = "p-0 cursor-pointer transform hover:scale-105 transition-all opacity-0 relative";
                projectCard.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
                
                let cardContent = `
                    <a href="${projectUrl}" target="_blank" class="block">
                        <div class="relative overflow-visible">
                            <img src="${projectImage}" alt="${projectName}" class="w-full h-60 object-cover">
                            <div class="absolute -bottom-5 left-0 right-0 z-10">
                                <div class="bg-white mx-auto w-4/5 py-2 px-4 rounded-full shadow-lg text-center border border-gray-200">
                                    <p class="text-lg font-semibold text-blue-700 truncate">${projectName}</p>
                                </div>
                            </div>
                        </div>`;
                
                // Açıklama varsa ekle (boş açıklama gösterme)
                if (projectDescription) {
                    cardContent += `
                        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 pt-10">
                            <p class="text-sm text-gray-600 text-center mt-4">${projectDescription}</p>
                        </div>`;
                } else {
                    cardContent += `
                        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 pt-10">
                            <!-- Boş açıklama alanı -->
                        </div>`;
                }
                
                cardContent += `</a>`;
                
                projectCard.innerHTML = cardContent;
                projectsContainer.appendChild(projectCard);
            } catch (error) {
                console.error(`Proje kartı oluşturulurken hata: ${projectName}`, error);
                
                // Hata olsa bile basit bir kart gösterelim
                const projectCard = document.createElement("div");
                projectCard.className = "p-0 cursor-pointer transform hover:scale-105 transition-all opacity-0 relative";
                projectCard.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
                projectCard.innerHTML = `
                    <a href="${projectUrl}" target="_blank" class="block">
                        <div class="relative overflow-visible">
                            <img src="src/images/default.jpg" alt="${projectName}" class="w-full h-60 object-cover">
                            <div class="absolute -bottom-5 left-0 right-0 z-10">
                                <div class="bg-white mx-auto w-4/5 py-2 px-4 rounded-full shadow-lg text-center border border-gray-200">
                                    <p class="text-lg font-semibold text-blue-700 truncate">${projectName}</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 pt-10">
                            <!-- Boş açıklama alanı -->
                        </div>
                    </a>
                `;

                projectsContainer.appendChild(projectCard);
            }
        });
    } catch (error) {
        console.error("Projeler alınırken hata oluştu:", error);
        
        // Hata durumunda yükleme animasyonunu gizle
        if (loadingAnimation) {
            loadingAnimation.style.display = "none";
        }
        
        // Hata mesajını göster
        projectsContainer.innerHTML = `<div class="col-span-3 text-center py-10">
            <p class="text-red-500">Projeler yüklenirken bir hata oluştu: ${error.message}</p>
            <p class="mt-2">Lütfen doğru GitHub kullanıcı adını kullandığınızdan emin olun ve internet bağlantınızı kontrol edin.</p>
            <button onclick="retryFetchRepositories()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Yeniden Dene</button>
        </div>`;
    }
}

async function getProjectImage(username, repoName) {
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/`);
        
        if (!response.ok) {
            throw new Error(`Repository içeriği alınamadı: ${response.status}`);
        }
        
        const files = await response.json();

        // project.img, thumbnail.jpg veya poster.jpg dosyalarını ara
        const imageFile = files.find(file => 
            file.name.toLowerCase() === "project.img" || 
            file.name.toLowerCase() === "thumbnail.jpg" || 
            file.name.toLowerCase() === "poster.jpg"
        );
        
        return imageFile ? imageFile.download_url : "src/images/default.jpg";
    } catch (error) {
        console.warn(`${repoName} için resim yüklenemedi:`, error);
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
`;
document.head.appendChild(style);

// Sayfa yüklendikten sonra projeleri getir
window.addEventListener('DOMContentLoaded', function() {
    fetchRepositories();
});
