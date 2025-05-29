const express = require('express');
const cors = require('cors')
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

const db = require('./db/conn')
const Certificado = require('./model/Certificado')

// Endpoint para listar imagens
app.get('/api/uploads', (req, res) => {
  const uploadsDir = path.join(__dirname, 'public/assets/uploads');

  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao ler diretório' });
    }

    // Filtrar apenas arquivos de imagem
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );

    res.json(imageFiles);
  });
});

// Servir arquivos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do multer para salvar imagens na pasta public/uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/assets/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// Endpoint para upload de imagens
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
    }

    res.status(200).json({
        message: 'Imagem enviada com sucesso!',
        filePath: `/uploads/${req.file.filename}`
    });
});

app.get('/certificado', (req, res) => {
    Certificado.findAll()
        .then((findAllCert) => {
            res.json(findAllCert.map(cert => cert.toJSON()));
        })
        .catch((error) => {
            res.status(500).json({ error: 'Erro ao listar os certificados: ' + error.message });
        });
});

// Endpoint para buscar que contém o nome do certificado
app.get('/certificado/:nm_certificado', (req, res) => {
    const nm_certificado = req.params.nm_certificado;

    Certificado.findAll({
        where: {
            nm_certificado: {
                [db.Sequelize.Op.like]: `%${nm_certificado}%`
            }
        }
    })
    .then((certificados) => {
        if (certificados.length === 0) {
            return res.status(404).json({ error: 'Nenhum certificado encontrado.' });
        }
        res.json(certificados.map(cert => cert.toJSON()));
    })
    .catch((error) => {
        res.status(500).json({ error: 'Erro ao buscar certificados: ' + error.message });
    });
});

app.post('/certificado', (req, res) => {
    const { nm_certificado, descricao, dt_emissao, carga_horaria } = req.body;
    
    if (!nm_certificado || !descricao || !dt_emissao ) {
        return res.status(400).json({ error: 'Todas as Informações tem que estar presentes.' });
    }

    Certificado.create({
        nm_certificado, 
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

app.put('/certificado/:nome', (req, res) => {
    const nm_certificado = req.params.nome;

    const { descricao, dt_emissao, carga_horaria } = req.body;

    if (!descricao || !dt_emissao ) {
        return res.status(400).json({ error: 'Todas as Informações tem que estar presentes.' });
    }

    Certificado.findOne({ where: { nm_certificado } })
        .then((cert) => {
            if (!cert) {
                return res.status(404).json({ error: 'Certificado não encontrado.' });
            }

            cert.update({ descricao, dt_emissao, carga_horaria })
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
    console.log(`> Servidor rodando na Porta http://localhost:${PORT}`);
})