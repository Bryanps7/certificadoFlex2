const express = require('express');
const cors = require('cors')

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

const db = require('./db/conn')
const Certificado = require('./model/Certificado')

app.get('/certificado', (req, res) => {
    Certificado.findAll()
        .then((findAllCert) => {
            res.json(findAllCert.map(cert => cert.toJSON()));
        })
        .catch((error) => {
            res.status(500).json({ error: 'Erro ao listar os certificados: ' + error.message });
        });
});

app.get('/certificado/:id', (req, res) => {
    const idCert = req.params.id;

    Certificado.findByPk(idCert)
        .then((cert) => {
            if (!cert) {
                // Se não encontrar o certificado
                return res.status(404).json({ error: 'Certificado não encontrada.' });
            }
            // Retorna os dados da certificado encontrada
            res.status(200).json(cert.toJSON());
        })
        .catch((error) => {
            // Caso ocorra algum erro durante a busca
            res.status(500).json({ error: 'Erro ao buscar o certificado: ' + error.message });
        });
});

app.post('/certificado', (req, res) => {
    const { nm_certificado, nm_beneficiado, descricao, dt_emissao, carga_horaria } = req.body;
    
    if (!nm_certificado || !nm_beneficiado || !descricao || !dt_emissao ) {
        return res.status(400).json({ error: 'Todas as Informações tem que estar presentes.' });
    }

    Certificado.create({
        nm_certificado, 
        nm_beneficiado, 
        descricao, 
        dt_emissao,
        carga_horaria
    })
    .then((newCert) => {
        console.log('> Certificado Cadastrado:', newCert.toJSON());
        res.status(201).json(newCert.toJSON());
    })

    .catch((error) => {
        console.error('> Erro ao cadastrar o Certificado:', error.message);
        res.status(500).json({ error: 'Erro ao cadastrar o Certificado: ' + error.message });
    });
});

app.put('/certificado/:id', (req, res) => {
    const idCert = req.params.id;

    const { nm_certificado, nm_beneficiado, descricao, dt_emissao, carga_horaria } = req.body;
    
    if (!nm_certificado || !nm_beneficiado || !descricao || !dt_emissao ) {
        return res.status(400).json({ error: 'Todas as Informações tem que estar presentes.' });
    }

    Certificado.findByPk(idCert)
        .then((cert) => {
            if (!cert) {
                return res.status(404).json({ error: 'Certificado não encontrado.' });
            }

            cert.update({ nm_certificado, nm_beneficiado, descricao, dt_emissao })
                .then((updatedCert) => {
                    res.status(200).json(updatedCert.toJSON());
                })
                .catch((error) => {
                    res.status(500).json({ error: 'Erro ao atualizar certificado: ' + error.message });
                });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Erro ao buscar certificado: ' + error.message });
        });
});

app.delete('/certificado/:id', (req, res) => {
    const idCert = req.params.id;

    Certificado.findByPk(idCert)
        .then((cert) => {
            if (!cert) {
                return res.status(404).json({ error: 'Certificado não encontrado.' });
            }

            cert.destroy()
                .then(() => {
                    res.status(200).json({ message: 'Certificado deletado com sucesso!' });
                })
                .catch((error) => {
                    res.status(500).json({ error: 'Erro ao deletar certificado: ' + error.message });
                });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Erro ao buscar certificado: ' + error.message });
        });
});

db.sync()
    .then(() => {
        console.log('> Banco de dados sincronizado com sucesso.');
    })
    .catch((error) => {
        console.error('> Erro ao sincronizar o banco de dados:', error.message);
    });

app.listen(PORT, () => {
    console.log(`> Servidor rodando na Porta : ${PORT}`);
})