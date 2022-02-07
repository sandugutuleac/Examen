import {useState, useEffect} from 'react';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import {post, put, get} from '../Calls.js';
import {jobPostingRoute} from '../ApiRoutes.js';
import { useNavigate, useParams } from 'react-router-dom';
import {Grid, TextField, Button, Paper, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, IconButton, DialogTitle} from '@material-ui/core';

export default function AddJobPosting(){

    const [jobPosting, setJobPosting] = useState
    ({
        JobPostingDescription: "",
        JobPostingDeadline: "2018-03-29"
    });

    const navigate = useNavigate();
    const routerParams = useParams();
    const id = routerParams.id;
    const [rows, setRows] = useState([]);

    useEffect(async () => {
        if (!id)
            return;

        let data = await get(jobPostingRoute, id);
        setJobPosting(data);    
    }, [])

     const onChangeMeeting = e => {
        setJobPosting({...jobPosting, [e.target.name]: e.target.value});
     }

    const saveJobPosting = async () => {
        if (!id)
            await post(jobPostingRoute, jobPosting);
        else
            await put(jobPostingRoute, id, jobPosting);
            
        navigate("/");    
    }

    return (
        <div>

            <DialogTitle align='left'>
                <b>Add a JobPosting</b>
            </DialogTitle>

            <Grid container spacing={3}>
                <Grid item xs={8} sm={8}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="JobPostingDescription"
                        name="JobPostingDescription"
                        label="JobPosting description"
                        fullWidth
                        value={jobPosting.JobPostingDescription}
                        onChange={e => onChangeMeeting(e)}
                        />
                </Grid>
                <Grid item xs={6} sm={4}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="JobPostingDeadline"
                        name="JobPostingDeadline"
                        label="JobPosting deadline"
                        fullWidth
                        value={jobPosting.JobPostingDeadline}
                        onChange={e => onChangeMeeting(e)}
                        />
                </Grid>
            </Grid>

            <br/>
            <br/>

            <Button color="secondary" variant='outlined' startIcon={<CancelIcon />}
                onClick={() => {navigate("/")}}
            >
                Cancel
            </Button>  

            <Button color="primary" variant='outlined' startIcon={<SaveIcon />}
                onClick={saveJobPosting}
            >
                Save
            </Button> 

            <br/>
            <br/>

            <DialogTitle align='left'>
                <b>Add candidates (Optional)</b>
            </DialogTitle>

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Candidate Id</TableCell>
                            <TableCell align="left">Candidate Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.ParticipantId}>
                                <TableCell component="th" scope="row">
                                    {row.ParticipantId}
                                </TableCell>
                                <TableCell align='left'>{}</TableCell>
                                <TableCell align='left'>{}</TableCell>
                                <TableCell align='left'>{}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <br/>
            <br/>

            <Button color="primary" variant='outlined' startIcon={<AddIcon />}
            >
                Add a candidate to JobPosting
            </Button> 

        </div>
    )
}