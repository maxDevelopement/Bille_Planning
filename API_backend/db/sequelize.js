const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize(
    'labille',
    'root',
    'Delta456@',{
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2',
            allowPublicKeyRetrieval: true,
            ssl: {
                // Vous pouvez également ajouter d'autres options SSL si nécessaire
                require: true,
                rejectUnauthorized: false // Utilisez cela avec prudence, préférablement dans un environnement de développement
            }
        },
        logging: false ////console.log 
    }
)
module.exports = { sequelize }