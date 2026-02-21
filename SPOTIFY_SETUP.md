# Spotify "Currently Listening To" Setup

To show your Spotify now-playing on the site, you need to deploy the API and connect your Spotify account.

## 1. Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in and click **Create app**
3. Name it (e.g. "My Website") and add a redirect URI: `http://127.0.0.1:3000/callback`  
   _(Spotify no longer accepts localhost — use 127.0.0.1)_
4. Copy your **Client ID** and **Client Secret**

## 2. Get Your Refresh Token

**Easiest:** Run the helper script (requires Node.js and OpenSSL):

```bash
CLIENT_ID=your_id CLIENT_SECRET=your_secret node scripts/spotify-get-token.js
```

It will open the authorize URL and print your refresh token when you approve.

## 3. Deploy to Vercel

1. Push your repo to GitHub (if not already)
2. Go to [vercel.com](https://vercel.com) and **Import** your repo
3. Add environment variables in Vercel Project Settings:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REFRESH_TOKEN`
4. Deploy — your API will be at `https://your-project.vercel.app/api/now-playing`

## 4. Connect Your Site

If your site is on **GitHub Pages** (tonyanguyen.github.io), add this to `index.html` before the jQuery script:

```html
<script>window.SPOTIFY_API_URL = 'https://your-project.vercel.app/api/now-playing';</script>
```

If you deploy the **whole site** to Vercel, the API is at the same origin — set:

```html
<script>window.SPOTIFY_API_URL = '/api/now-playing';</script>
```

## Done

The "Currently listening to" text will update every 30 seconds when something is playing on Spotify.
