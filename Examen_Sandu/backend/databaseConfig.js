import Sequelize from 'sequelize';
import { DB_USERNAME, DB_PASSWORD, DB_NAME } from './Consts.js';

const db = new Sequelize({
    dialect: 'mysql',
    database: DB_NAME,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    logging: false,
    define: {
        timestamps: false,
        freezeTableName: true
    }
})

export default db;