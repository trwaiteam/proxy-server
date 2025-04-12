# VoiceFlow Proxy Server

This is a secure proxy server for VoiceFlow API calls. It keeps your API keys secure by handling all VoiceFlow API requests on the server side.

## Setup

1. Clone this repository:
```bash
git clone <your-repository-url>
cd voiceflow-proxy-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your VoiceFlow credentials:
```
VITE_VOICEFLOW_API_KEY=your-api-key
VITE_VOICEFLOW_VERSION_ID=production
VITE_VOICEFLOW_PROJECT_ID=your-project-id
PORT=3000
```

5. Start the server:
```bash
npm start
```

## Production Deployment

### Digital Ocean Deployment

1. Create a Digital Ocean Droplet (Ubuntu 22.04 LTS recommended)
2. SSH into your droplet
3. Install Node.js:
```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs
```

4. Clone this repository:
```bash
git clone <your-repository-url>
cd voiceflow-proxy-server
```

5. Install dependencies:
```bash
npm install
```

6. Set up environment variables:
```bash
cp .env.example .env
nano .env
```

7. Install PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

8. (Optional) Set up Nginx as reverse proxy:
```bash
apt install nginx
```

## API Endpoints

- `POST /api/voiceflow/:userID/interact` - Send user interactions to VoiceFlow
- `GET /api/voiceflow/:userID` - Get user state
- `PUT /api/voiceflow/transcripts` - Save conversation transcripts

## Client Integration

Add this to your website:

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="your-widget-url/chatbot-widget.umd.js"></script>
<script>
  window.onload = function() {
    if (window.ChatbotWidget) {
      window.ChatbotWidget.initChatbot({
        baseUrl: 'your-widget-url',
        serverUrl: 'your-proxy-server-url/api/voiceflow'
      });
    }
  };
</script>
``` 