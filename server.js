import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables
dotenv.config();

// Get current directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // In production, you should specify allowed origins
  methods: ['GET', 'POST', 'PUT'], // Added PUT for transcript requests
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from the dist directory with CORS headers
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    // Set CORS headers for font files
    if (path.endsWith('.ttf') || path.endsWith('.woff') || path.endsWith('.woff2')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
  }
}));

// Proxy endpoint for Voiceflow API
app.post('/api/voiceflow/:userID/interact', async (req, res) => {
  try {
    const { userID } = req.params;
    const VITE_VOICEFLOW_API_KEY = process.env.VITE_VOICEFLOW_API_KEY;
    const VITE_VOICEFLOW_VERSION_ID = process.env.VITE_VOICEFLOW_VERSION_ID;
    
    if (!VITE_VOICEFLOW_API_KEY) {
      return res.status(500).json({ error: 'API key not configured on server' });
    }
    
    const response = await axios.post(
      `https://general-runtime.voiceflow.com/state/user/${userID}/interact`,
      req.body,
      {
        headers: {
          'Authorization': VITE_VOICEFLOW_API_KEY,
          'Content-Type': 'application/json',
          'versionID': VITE_VOICEFLOW_VERSION_ID || 'production'
        }
      }
    );
    
    return res.json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// Get state endpoint
app.get('/api/voiceflow/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const VITE_VOICEFLOW_API_KEY = process.env.VITE_VOICEFLOW_API_KEY;
    const VITE_VOICEFLOW_VERSION_ID = process.env.VITE_VOICEFLOW_VERSION_ID;
    
    if (!VITE_VOICEFLOW_API_KEY) {
      return res.status(500).json({ error: 'API key not configured on server' });
    }
    
    const response = await axios.get(
      `https://general-runtime.voiceflow.com/state/user/${userID}`,
      {
        headers: {
          'Authorization': VITE_VOICEFLOW_API_KEY,
          'Content-Type': 'application/json',
          'versionID': VITE_VOICEFLOW_VERSION_ID || 'production'
        }
      }
    );
    
    return res.json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// Add transcript saving endpoint
app.put('/api/voiceflow/transcripts', async (req, res) => {
  try {
    const VITE_VOICEFLOW_API_KEY = process.env.VITE_VOICEFLOW_API_KEY;
    const VITE_VOICEFLOW_PROJECT_ID = process.env.VITE_VOICEFLOW_PROJECT_ID;
    
    if (!VITE_VOICEFLOW_API_KEY) {
      return res.status(500).json({ error: 'API key not configured on server' });
    }

    if (!VITE_VOICEFLOW_PROJECT_ID) {
      return res.status(500).json({ error: 'Project ID not configured on server' });
    }
    
    const response = await axios.put(
      'https://api.voiceflow.com/v2/transcripts',
      {
        ...req.body,
        projectID: VITE_VOICEFLOW_PROJECT_ID
      },
      {
        headers: {
          'Authorization': VITE_VOICEFLOW_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return res.json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// Listen on all network interfaces (important for DO)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}); 