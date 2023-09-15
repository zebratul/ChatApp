require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;

if (!sequelize) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        define: {
            timestamps: true,
            underscored: true,
        },
        logging: (query, ms) => {
            if (ms > 100) {
                console.log(`${query} (${ms}ms)`);
            }
        },
    });
}

module.exports = sequelize;
