const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Certificado = db.define('certificado', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nm_certificado: { // Ex: "Certificado de Conclusão"
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: { // Descrição do certificado
        type: DataTypes.STRING,
        allowNull: false
    },
    dt_emissao: { // Data de emissão
        type: DataTypes.DATE,
        allowNull: false
    },
    carga_horaria: { // Opcional
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = Certificado;