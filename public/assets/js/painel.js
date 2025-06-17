// JavaScript para alternar tema
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;
toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const icon = toggleButton.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Painel agora será usando localStorage
document.getElementById('formCadastrar').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const certificado = {
        nome: formData.get('nome'),
        descricao: formData.get('descricao'),
        data: formData.get('data'),
        carga: formData.get('carga') || null
    };
    localStorage.setItem(certificado.nome, JSON.stringify(certificado));
    alert('Certificado cadastrado com sucesso!');
    event.target.reset();
});

document.getElementById('formListar').addEventListener('submit', function (event) {
    event.preventDefault();
    const certificados = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const certificado = JSON.parse(localStorage.getItem(key));
        certificados.push(certificado);
    }

    const listaDiv = document.getElementById('certificados-lista');
    listaDiv.innerHTML = ''; // Limpa o conteúdo anterior

    if (certificados.length === 0) {
        listaDiv.innerHTML = '<p>Nenhum certificado encontrado.</p>';
    } else {
        const ul = document.createElement('ul');
        certificados.forEach(certificado => {
            const dataFormatada = new Date(certificado.data).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            const li = document.createElement('li');
            li.innerHTML = `
                <h3>${certificado.nome}<br></h3>
                <b>Descrição:</b> ${certificado.descricao} <br>
                <b>Data:</b> ${dataFormatada} <br>
                <b>Carga Horária:</b> ${certificado.carga || 'N/A'}`;
            ul.appendChild(li);
        });
        listaDiv.appendChild(ul);
    }
});

document.getElementById('formApagar').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nome = formData.get('nome');
    if (localStorage.getItem(nome)) {
        localStorage.removeItem(nome);
        alert('Certificado apagado com sucesso!');
    } else {
        alert('Certificado não encontrado.');
    }
});

document.getElementById('formAtualizar').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nome = formData.get('nome');
    if (localStorage.getItem(nome)) {
        const certificado = {
            nome: nome,
            descricao: formData.get('descricao'),
            data: formData.get('data'),
            carga: formData.get('carga') || null
        };
        localStorage.setItem(nome, JSON.stringify(certificado));
        alert('Certificado atualizado com sucesso!');
        event.target.reset();
    } else {
        alert('Certificado não encontrado.');
    }
});

// Adiciona funcionalidade de navegação
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.tab-content').forEach(section => {
            section.classList.remove('active');
        });
        const target = document.querySelector(link.getAttribute('href'));
        target.classList.add('active');
        console.log(`Seção ativa: ${target.id}`);
    });
});

// Exibe a seção "Cadastrar" por padrão ao carregar
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#cadastrar').classList.add('active');
});