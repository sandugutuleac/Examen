import {useState, useEffect} from 'react';
import {get, remove} from '../Calls.js';
import {Button, Paper, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, IconButton, DialogTitle} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ImportIcon from '@material-ui/icons/Send';
import ExportIcon from '@material-ui/icons/ImportContacts';
import EditIcon from '@material-ui/icons/Edit';
import MenuIcon from '@material-ui/icons/Menu';
import { jobPostingRoute } from '../ApiRoutes.js';
import { useNavigate } from 'react-router-dom';

export default function JobPostingList(){
    
    const [rows, setRows] = useState([]);
    const [needUpdate, setNeedUpdate] = useState(false);
    const navigate = useNavigate();

    useEffect(async () => {
        let data = await get(jobPostingRoute);
        setRows(data);
    }, [needUpdate]);

    const deleteJobPosting = async(id, index) => {
        await remove(jobPostingRoute, id);

        rows.splice(index, 1);
        setRows(rows);
        setNeedUpdate(!needUpdate);
        alert("JobPosting id:" + id + " has been successfully deleted!")
    }

    return(
        <div>

            <DialogTitle>
                <b>JobPostings</b>
            </DialogTitle>

            <div>
                <Button
                    variant='contained'
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={() => {navigate("AddJobPosting")}}
                >
                    Add new JobPosting
                </Button>
            </div>

            <br/>

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>JobPosting Id</TableCell>
                            <TableCell align="left">JobPosting Description</TableCell>
                            <TableCell align="left">JobPosting Deadline</TableCell>
                            <TableCell align="left">Candidates</TableCell>
                            <TableCell align="left">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.JobPostingId}>
                                <TableCell component="th" scope="row">
                                    {row.JobPostingId}
                                </TableCell>
                                <TableCell align='left'>{row.JobPostingDescription}</TableCell>
                                <TableCell align='left'>{row.JobPostingDate}</TableCell>
                                <TableCell align='left'>
                                    <IconButton onClick={() => navigate(`/Candidates/${row.JobPostingId}`)}>
                                        <MenuIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell align="left">
                                    <IconButton onClick={() => navigate(`/AddJobPosting/${row.JobPostingId}`)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteJobPosting(row.JobPostingId, index)}>
                                        <DeleteIcon color="secondary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <br/>
            <br/>
            <br/>

            <Button
                    variant='contained'
                    color="primary"
                    startIcon={<ImportIcon />}
                    onClick={() => {}}
                >
                    Import
                </Button>
                <Button
                    variant='contained'
                    color="primary"
                    startIcon={<ExportIcon />}
                    onClick={() => {}}
                >
                    Export
                </Button>
        </div>
    )
}