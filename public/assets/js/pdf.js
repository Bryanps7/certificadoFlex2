const gerar_certificado = document.getElementById('gerar-certificado');

gerar_certificado.addEventListener('click', async () => {
    const nm_certificado = document.getElementById('certificado').innerHTML;
    const json_string = window.localStorage.getItem(nm_certificado);
    const dados = JSON.parse(json_string);
    const background = document.getElementById('img-escolhida').innerHTML;
    const nm_beneficiado = document.getElementById('nome-beneficiado').value;

    const modelo = document.getElementById('campo');

    console.log(`nm_certificado: ${nm_certificado}`);
    console.log(`dados: ${JSON.stringify(dados, null)}`);
    console.log(`background: ${background}`);

    // console.log(`dados especificos: ${dados.}`);

    if (!nm_certificado || !dados || !background) {
        alert('Todas as Informações tem que estar presentes.');
        return;
    }

    modelo.style.backgroundImage = `url('${background}')`;
    modelo.style.backgroundSize = 'cover';
    modelo.style.width = '297mm';
    modelo.style.height = '210mm';
    modelo.style.padding = '20mm';
    modelo.style.boxSizing = 'border-box';
    modelo.style.display = 'flex';
    modelo.style.flexDirection = 'column';
    modelo.style.justifyContent = 'center';
    modelo.style.alignItems = 'center';
    modelo.style.textAlign = 'center';

    const data = new Date(JSON.stringify(dados.data).replaceAll('"', '')).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    modelo.innerHTML = `
        <h1 style="font-size: 2.5em; margin-top: 50px;">${nm_certificado}</h1>
        <p style="font-size: 1.5em;" id='aluno-safada'>O Aluno: ${nm_beneficiado}</p>
        <p style="font-size: 1.5em;" id='descricao-safada'>${JSON.stringify(dados.descricao).replaceAll('"', '')}</p>
        <p style="font-size: 1.5em;" id='data-safada'>${data}</p>
        <p style="font-size: 1.5em;" id='carga-safada'>Carga Horária: ${JSON.stringify(dados.carga).replaceAll('"', '')}</p>
    `

    const download = document.createElement('button');
    download.textContent = 'Download do Certificado';
    download.style.marginTop = '20px';
    download.style.padding = '10px 20px';
    download.style.fontSize = '1.2em';
    download.style.cursor = 'pointer';
    download.id = 'download';
    download.onclick = baixarMano;
    download.style.backgroundColor = '#4CAF50';


    document.querySelector('body').appendChild(download);
});

function baixarMano() {
    console.log('Baixando o certificado...');

    // const nm_certificado = document.getElementById('nome-beneficiado').value;
    const nm_certificado = "Bryan Prinz"
    const slug_beneficiado = nm_certificado.replace(/ /g, '-').toLowerCase();
    console.log(slug_beneficiado);
    // const nm_beneficiado = document.getElementById('aluno-safada').innerHTML;
    // const dados = document.getElementById('descricao-safada').innerHTML
    // const data = document.getElementById('data-safada').innerHTML;
    // const cargo = document.getElementById('carga-safada').innerHTML;

    const element = `
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            div {
                margin: 0;
                padding: 0;
                background-color: red;
                width: 297mm;
                height: 794px;
                box-sizing: border-box;
            }
        </style>

        <div>
            <h1>Curso de Programação com Node.js</h1>
            <p id="aluno-safada">O Aluno: Bryan Prinz</p>
            <p id="descricao-safada">Certificado de conclusão do curso intensivo de Programação Web.</p>
            <p id="data-safada">19 de agosto de 2025</p>
            <p id="carga-safada">Carga Horária: 800</p>
        </div>
    `

    // <h1 style="font-size: 2.5em;">${nm_certificado}</h1>
    // <p style="font-size: 1.5em;">O Aluno: ${nm_beneficiado}</p>
    // <p style="font-size: 1.5em;">${dados}</p>
    // <p style="font-size: 1.5em;">${data}</p>
    // <p style="font-size: 1.5em;">Carga Horária: ${cargo}</p>

    // element.style.margin = '0';
    // element.style.width = '210mm';
    // element.style.height = '297mm';
    // element.style.display = 'block';
    // element.style.position = 'relative';
    // element.style.backgroundColor = '#fff';

    // const h1 = element.querySelector('h1');
    // if (h1) {
    //     h1.style.marginTop = '0';
    // }

    const options = {
        margin: [0, 0, 0, 0],
        filename: `certificado-de-${slug_beneficiado}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'landscape'
        },
        // image: {
        //     type: 'jpeg',
        //     quality: 0.98
        // },
        // setDisplayMode: 'fullpage'
    };

    html2pdf().set(options).from(element).save().then(() => {
        console.log('PDF gerado com sucesso!');
        alert('Certificado gerado com sucesso!');
        document.body.removeChild(element); // Remove a cópia após gerar o PDF
    }).catch((error) => {
        console.error('Erro ao gerar o PDF:', error);
        alert('Erro ao gerar o certificado. Por favor, tente novamente.');
        document.body.removeChild(element); // Remove a cópia em caso de erro
    });
}