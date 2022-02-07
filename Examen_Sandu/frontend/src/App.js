import './App.css';
import JobPostingList from './components/JobPostingList.js'
import AddJobPosting from './components/AddJobPosting.js'
import Candidates from './components/Candidates.js'
import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/" element ={<JobPostingList/>} />
            <Route path="/AddJobPosting" element ={<AddJobPosting/>} />
            <Route path="/AddJobPosting/:id" element ={<AddJobPosting/>} />
            <Route path="/Candidates/:id" element ={<Candidates/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
