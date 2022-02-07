// Candidate class
import Sequelize from 'sequelize';
import db from '../databaseConfig.js';

const Candidate = db.define("Candidate", {

    CandidateId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    CandidateName: {
        type: Sequelize.STRING,
        // Range between 5 and 200 characters
        validate: {
            len: [5,200]
        },
        allowNull: true
    },

    CandidateCV: {
        type: Sequelize.STRING,
        // Range between 100 and 200 characters
        validate: {
            len: [100,200]
        },
        allowNull: false
    },

    CandidateEmail: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        },
        allowNull: false
    }


})

export default Candidate;