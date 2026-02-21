#!/usr/bin/env node
/**
 * Spotify refresh token helper
 * Uses 127.0.0.1 (Spotify requires this over "localhost")
 * Run: CLIENT_ID=xxx CLIENT_SECRET=xxx node scripts/spotify-get-token.js
 */

const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const url = require('url');

const REDIRECT_URI = 'http://127.0.0.1:3000/callback';
const CLIENT_ID = (process.env.SPOTIFY_CLIENT_ID || process.env.CLIENT_ID || '').trim();
const CLIENT_SECRET = (process.env.SPOTIFY_CLIENT_SECRET || process.env.CLIENT_SECRET || '').trim();

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.log('\nUsage:');
  console.log('  CLIENT_ID=your_id CLIENT_SECRET=your_secret node scripts/spotify-get-token.js\n');
  console.log('Get these from: https://developer.spotify.com/dashboard → Your App → Settings\n');
  process.exit(1);
}

const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-read-currently-playing`;

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname === '/callback' && parsed.query.code) {
    const code = parsed.query.code;
    const body = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;

    const options = {
      hostname: 'accounts.spotify.com',
      path: '/api/token',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': body.length }
    };

    const tokenReq = https.request(options, (tokenRes) => {
      let data = '';
      tokenRes.on('data', (chunk) => data += chunk);
      tokenRes.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.refresh_token) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<html><body style="font-family:sans-serif;padding:40px;max-width:500px"><h2>Success!</h2><p>Your refresh token:</p><pre style="background:#eee;padding:12px;overflow:auto">${json.refresh_token}</pre><p>Copy this and add it as <code>SPOTIFY_REFRESH_TOKEN</code> in Vercel.</p><p>You can close this tab.</p></body></html>`);
            console.log('\n\n✅ Refresh token received!\n');
            console.log(json.refresh_token);
            console.log('\nAdd this as SPOTIFY_REFRESH_TOKEN in your Vercel env vars.\n');
          } else {
            const errMsg = json.error_description || json.error || JSON.stringify(json);
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<html><body style="font-family:sans-serif;padding:40px"><h2>Spotify error</h2><p>${errMsg}</p><p>invalid_client = wrong Client ID or Client Secret, or redirect URI mismatch.</p></body></html>`);
            console.error('Spotify error:', errMsg);
          }
        } catch (e) {
          res.writeHead(500);
          res.end('Parse error');
          console.error(data);
        }
        server.close();
        process.exit(0);
      });
    });
    tokenReq.on('error', (e) => {
      res.writeHead(500);
      res.end('Request failed');
      console.error(e);
      server.close();
    });
    tokenReq.write(body);
    tokenReq.end();
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3000, () => {
  console.log('\n🔗 Open this URL in your browser and approve:\n');
  console.log(authUrl);
  console.log('\nWaiting for callback...\n');
  if (process.platform === 'darwin') exec('open "' + authUrl + '"');
  else if (process.platform === 'win32') exec('start "" "' + authUrl + '"');
});
