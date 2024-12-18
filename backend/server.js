const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { connectToDB, saveFileRecord, deleteFileRecord, fetchFileRecords, deleteallRecord } = require('./db');
const { processFile } = require('./regexUtil');

const corsOptions = {
    origin: 'https://clearscanproject.vercel.app', // Your frontend URL
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  };
  

  
// Initialize app
const app = express();
app.use(cors(corsOptions));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite Database
connectToDB();

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes

// Upload File
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // console.log("here");
        // console.log(req.file.path);
        const filePath = req.file;
        console.log("Processing file...");
        const extractedData = await processFile(filePath);
        const savedFile = await saveFileRecord(req.file.originalname, extractedData);

        res.status(200).json({ message: 'File uploaded successfully!', savedFile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing file.' });
    }
});

// Fetch All Files
app.get('/scanned-files', async (req, res) => {
    try {
        const files = await fetchFileRecords();
        console.log("server area");
        console.log(files);
        res.status(200).json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching files.' });
    }
});

// Endpoint to delete all records
app.delete('/delete-all', async (req, res) => {
    try {
        // const { fileName }= req.body;
        await deleteallRecord();
        res.status(200).json({ message: 'Table deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting table.' });
    }
});

// Delete File
app.delete('/delete', async (req, res) => {
    try {
        const { fileName }= req.body;
        await deleteFileRecord(fileName);
        res.status(200).json({ message: 'File deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting file.' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on ${process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`}`);
});w
