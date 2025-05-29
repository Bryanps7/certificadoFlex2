const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");

// Permitir clique para abrir o seletor de arquivos
dropZone.addEventListener("click", () => {
    fileInput.click();
});

// Quando o usuário seleciona uma imagem via input
fileInput.addEventListener("change", () => {
    handleFiles(fileInput.files);
});

// Arrastar arquivos
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("active");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("active");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("active");
    handleFiles(e.dataTransfer.files);
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
                    dropZone.appendChild(img);
                })
                .catch(error => {
                    console.error("Erro ao enviar a imagem:", error);
                });
        }
    }
}