const btn = document.getElementById('criar-certificado');

btn.addEventListener('click', async () => {
    const nm_certificado = document.getElementById('certificado-nome').value;
    const nm_beneficiado = document.getElementById('beneficiado-nome').value;
    const descricao = document.getElementById('certificado-descricao').value;
    const dt_emissao = document.getElementById('certificado-data').value;
    const background = document.getElementById('img-escolhida').innerHTML;

    console.log(`nm_certificado: ${nm_certificado}`);
    console.log(`nm_beneficiado: ${nm_beneficiado}`);
    console.log(`descricao: ${descricao}`);
    console.log(`dt_emissao: ${dt_emissao}`);
    console.log(`background: ${background}`);

    const slug_beneficiado = nm_beneficiado.replace(/ /g, '-').toLowerCase(); // substitui espaços por traços e converte para minúsculas

    if (!nm_certificado || !nm_beneficiado || !descricao || !dt_emissao || !background) {
        alert('Todas as Informações tem que estar presentes.');
        return;
    } else {
        const options = { // configurações do pdf
            margin: [10, 10, 10, 10], // margem
            filename: `certificado-de-${slug_beneficiado}.pdf`, // nome do arquivo
            html2canvas: { scale: 2 }, // Escala obs: 2 padrão do html
            jsPDF: {
                unit: 'mm', // unidade obs: mm = milimetro
                format: 'a4', // formato A4
                orientation: 'landscape' // Orientação Retrato
            }
        }

        const element = `
            <div id="certificado" style="width: 210mm; height: 297mm; background-image: url('${background}'); background-size: cover; padding: 20mm; box-sizing: border-box;">
                <h1 style="text-align: center; font-size: 2.5em; margin-top: 50px;">${nm_certificado}</h1>
            </div>
        `

        console.log('Gerando PDF com as seguintes opções:', options);
        console.log('Gerando PDF com o seguinte conteúdo:', element);

        html2pdf().set(options).from(element).save().then(() => {
            console.log('PDF gerado com sucesso!');
            alert('Certificado gerado com sucesso!');
        }).catch((error) => {
            console.error('Erro ao gerar o PDF:', error);
            alert('Erro ao gerar o certificado. Por favor, tente novamente.');
        });
    }
})