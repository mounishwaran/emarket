const express = require('express');
const app = express();
const PORT = 3000;

let cases = [];
let meetings = [];

app.use(express.json());
app.use(express.static('public')); 

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/public/lawyerdash.html');
});

// Route to access add cases page
app.get('/add-case', (req, res) => {
    res.sendFile(__dirname + '/public/addcases.html');
});


// API for Cases
app.get('/api/cases', (req, res) => {
    res.json(cases);
});

app.post('/api/cases', (req, res) => {
    const newCase = req.body;
    cases.push(newCase);
    res.status(201).json(newCase);
});

// Handle Delete Case
app.delete('/api/cases/:id', (req, res) => {
    const caseId = req.params.id;
    cases = cases.filter(c => c.caseID !== caseId);
    res.sendStatus(204); // No Content
});

// Handle Update Case
app.put('/api/cases/:id', (req, res) => {
    const caseId = req.params.id;
    const index = cases.findIndex(c => c.caseID === caseId);
    if (index !== -1) {
        cases[index] = req.body;
        res.json(cases[index]);
    } else {
        res.sendStatus(404); // Not Found
    }
});

// API for Meetings
app.get('/api/meetings', (req, res) => {
    res.json(meetings);
});

app.post('/api/meetings', (req, res) => {
    const newMeeting = { id: Date.now(), ...req.body }; // Use timestamp as unique ID
    meetings.push(newMeeting);
    res.status(201).json(newMeeting);
});

// Handle Delete Meeting
app.delete('/api/meetings/:id', (req, res) => {
    const meetingId = parseInt(req.params.id, 10);
    meetings = meetings.filter(m => m.id !== meetingId);
    res.sendStatus(204); // No Content
});

// Handle Update Meeting
app.put('/api/meetings/:id', (req, res) => {
    const meetingId = parseInt(req.params.id, 10);
    const index = meetings.findIndex(m => m.id === meetingId);
    if (index !== -1) {
        meetings[index] = { ...meetings[index], ...req.body };
        res.json(meetings[index]);
    } else {
        res.sendStatus(404); // Not Found
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
