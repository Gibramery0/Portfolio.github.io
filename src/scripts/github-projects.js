const username = "Gibramery0"; 
const projectsContainer = document.getElementById("projects-container");

async function fetchRepositories() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const repositories = await response.json();

        projectsContainer.innerHTML = ""; 

        repositories.forEach(async (repo) => {
            const projectName = repo.name;
            const projectUrl = repo.html_url;
            const projectImage = await getProjectImage(username, projectName);

            
            const projectCard = document.createElement("div");
            projectCard.className = "bg-white p-5 rounded-lg shadow-md cursor-pointer transform hover:scale-105 transition-all";
            projectCard.innerHTML = `
                <a href="${projectUrl}" target="_blank">
                    <img src="${projectImage}" alt="${projectName}" class="w-full h-48 object-cover rounded-md mb-3">
                    <p class="text-lg font-semibold">${projectName}</p>
                </a>
            `;

            projectsContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.error("Projeler alınırken hata oluştu:", error);
    }
}

async function getProjectImage(username, repoName) {
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/`);
        const files = await response.json();

        const projectImage = files.find(file => file.name.toLowerCase() === "project.img");
        return projectImage ? projectImage.download_url : "src/images/default.jpg";
    } catch (error) {
        return "src/images/default.jpg";
    }
}


fetchRepositories();
