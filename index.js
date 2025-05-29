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

app.listen(PORT, () => {
    console.log(`> Servidor rodando na Porta http://localhost:${PORT}`);
})