// JobPosting class
import Sequelize from 'sequelize';
import db from '../databaseConfig.js';

const JobPosting = db.define("JobPosting", {

    JobPostingId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        onDelete: 'CASCADE',
    },

    JobPostingDescription: {
        type: Sequelize.STRING,
        // Range between 3 and 200 characters
        validate: {
            len: [3,200]
        },
        allowNull: false
    },

    JobPostingDeadline: {
        type: Sequelize.DATE,
        allowNull: false
    }
})

export default JobPosting;