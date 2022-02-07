import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import { DB_USERNAME, DB_PASSWORD, SERVER_PORT, DB_NAME } from './Consts.js';
import db from './databaseConfig.js';
import Candidate from './entities/Candidate.js';
import JobPosting from './entities/JobPostiong.js';
import Operator from './Operator.js';

let app = express();
let router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

let conn;

mysql.createConnection({
    user: DB_USERNAME,
    password: DB_PASSWORD
})
.then((connection) => {
    conn = connection;
    return connection.query('CREATE DATABASE IF NOT EXISTS ' + DB_NAME);
})
.then(() => {
    return conn.end();
})
.catch((err) => {
    console.warn(err.stack);
})

JobPosting.hasMany(Candidate, {as : "Candidates", foreignKey: "JobPostingId"});
Candidate.belongsTo(JobPosting, { foreignKey: "JobPostingId"})

db.sync();

// ---------------------------- Begin Logic functions --------------------

// Logic Functions for Candidate
async function createCandidate(candidate) {
    return await Candidate.create(candidate);
}

async function getCandidate() {
    return await Candidate.findAll();
}

async function getCandidateById(id) {
    return await Candidate.findByPk(id);
}

async function updateCandidate(id, candidate) {
    if(parseInt(id) !== candidate.CandidateId) {
        console.log("The id of the entity is different!");
        return;
    }

    let updateEntity = await getCandidateById(id);

    if(!updateEntity) {
        console.log("There isn't a candidate with this id!");
        return;
    }

    return updateEntity.update(candidate);
}

async function deleteCandidate(id) {
    let deleteEntity = await getCandidateById(id);

    if(!deleteEntity) {
        console.log("There isn't a candidate with this id!");
        return;
    }

    return await deleteEntity.destroy();
}


// Logic Functions for JobPosting
async function createJobPosting(jobPosting) {
    return await JobPosting.create(jobPosting, {include: [{model: Candidate, as : "Candidates"}]});
}

async function getJobPosting() {
    return await JobPosting.findAll({include: ["Candidates"]});
}

async function getJobPostingById(id) {
    return await JobPosting.findByPk(id, {include: ["Candidates"]});
}

async function updateJobPosting(id, jobPosting) {
    if(parseInt(id) !== jobPosting.JobPostingId) {
        console.log("The id of the entity is different!");
        return;
    }

    let updateEntity = await getJobPostingById(id);

    if(!updateEntity) {
        console.log("There isn't a jobposting with this id!");
        return;
    }

    return updateEntity.update(jobPosting);
}

async function deleteJobPosting(id) {
    let deleteEntity = await getJobPostingById(id);

    if(!deleteEntity) {
        console.log("There isn't a jobposting with this id!");
        return;
    }

    const deleteEntityWithChilds = () => {
        Candidate.destroy({
            where: id ? {JobPostingId: id} : undefined
        });

        deleteEntity.destroy();
    }

    return await deleteEntityWithChilds();
}

// Logic Function for filtering
async function filterJobPosting(filter){
    let whereClause = {};

    if(filter.jobPostingDescription)
        whereClause.JobPostingDescription = {[Operator] : `%${filter.jobPostingDescription}%`};

    if(filter.jobPostingDeadline)
        whereClause.JobPostingDeadline = {[Operator] : `%${filter.jobPostingDeadline}%`};

    return await JobPosting.findAll({
        where: whereClause
    });
}

// Logic Function for sorting
async function getJobPostingByDescription(description){
    return await JobPosting.findAll({
        where: description ? {JobPostingDescription: description} : undefined
    });

    // Test in postman : http://localhost:8000/api//meetingSort?description=Web_Exam
}


// ---------------------------- End Logic functions ----------------------




// ---------------------------- Begin Routes -----------------------------

// Create the database with relations
router.route('/create').get(async (req, res) => {
    try {
        await db.sync({force: true})
        res.status(201).json({message: 'created'});

    } catch (err) {
        console.warn(err.stack);
        res.status(500).json({message: 'server error'});
    }
})

//Routes for Candidate
router.route('/candidates').post(async (req, res) => {
    res.json(await createCandidate(req.body));
})

router.route('/candidates').get(async (req, res) => {
    res.json(await getCandidate(req.body));
})

router.route('/candidates/:id').get(async (req, res) => {
    res.json(await getCandidateById(req.params.id));
})

router.route('/candidates/:id').put(async (req, res) => {
    res.json(await updateCandidate(req.params.id, req.body));
})

router.route('/candidates/:id').delete(async (req, res) => {
    res.json(await deleteCandidate(req.params.id));
})

// Routes for JobPosting
router.route('/jobposting').post(async (req, res) => {
    res.json(await createJobPosting(req.body));
})

router.route('/jobposting').get(async (req, res) => {
    res.json(await getJobPosting(req.body));
})

router.route('/jobposting/:id').get(async (req, res) => {
    res.json(await getJobPostingById(req.params.id));
})

router.route('/jobposting/:id').put(async (req, res) => {
    res.json(await updateJobPosting(req.params.id, req.body));
})

router.route('/jobposting/:id').delete(async (req, res) => {
    res.json(await deleteJobPosting(req.params.id));
})

router.route('/jobpostingFilter').get(async (req, res) =>{
    return res.json(await filterJobPosting(req.query));
})

router.route('/jobpostingSort').get( async (req, res) => {
    return res.json(await getJobPostingByDescription(req.query.description));
})

// ---------------------------- End Routes -------------------------------

let port = process.env.PORT || SERVER_PORT;
app.listen(port);
console.log(`API is running at ${port}`);