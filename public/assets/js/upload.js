const dropZone = document.getElementById("dropZone");
const overlay = document.getElementById("overlay");
const fileInput = document.getElementById("fileInput");
const toggleButton = document.getElementById("theme-toggle");
const body = document.body;

// Permitir clique para abrir o seletor de arquivos
overlay.addEventListener("click", () => {
    fileInput.click();
});

// Quando o usuário seleciona uma imagem via input
fileInput.addEventListener("change", () => {
    handleFiles(fileInput.files);
});

// Arrastar arquivos
document.addEventListener("dragenter", (e) => {
    e.preventDefault();
    overlay.style.display = "flex"; // Exibe o overlay
});

document.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy"; // Indica que o arquivo pode ser solto
});

document.addEventListener("dragleave", (e) => {
    e.preventDefault();
    const rect = overlay.getBoundingClientRect();
    const isOutside =
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom;

    if (isOutside) {
        overlay.style.display = "none"; // Oculta o overlay
    }
});

overlay.addEventListener("drop", (e) => {
    e.preventDefault();
    overlay.style.display = "none"; // Oculta o overlay após soltar a imagem

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        console.log("Imagem solta:", files[0]);
        handleFiles(files); // Processa os arquivos soltos
    }
});

// Função central para envio e exibição das imagens
function handleFiles(files) {
    for (const file of files) {
        if (file.type.startsWith("image/")) {
            const formData = new FormData();
            formData.append("image", file);

            // Envia para o backend
            fetch("http://localhost:3000/upload", {
                method: "POST",
                body: formData
            })
                .then(response => response.json())
                .then(result => {
                    console.log("Imagem enviada com sucesso:", result);

                    const img = document.createElement("img");
                    img.src = `/assets/uploads/${result.filePath.split('/').pop()}`;
                    document.getElementById("dropZone").appendChild(img); // Exibe a imagem no campo correto

                    // Exibe o alerta de sucesso
                    alert("Imagem enviada com sucesso!");
                })
                .catch(error => {
                    console.error("Erro ao enviar a imagem:", error);
                    alert("Erro ao enviar a imagem. Tente novamente.");
                });
        } else {
            alert("Por favor, solte apenas arquivos de imagem.");
        }
    }
}

// Alternar entre modo claro e escuro
toggleButton.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    const icon = toggleButton.querySelector("i");
    if (body.classList.contains("dark-mode")) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }
});