/**
 * Spotify Now Playing API
 * Deploy to Vercel: the /api folder becomes serverless functions.
 *
 * Setup:
 * 1. Create a Spotify app at https://developer.spotify.com/dashboard
 * 2. Get your Client ID and Client Secret
 * 3. Get a refresh token: https://leerob.io/blog/spotify-api-nextjs has a guide
 * 4. Add env vars in Vercel: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
 */

export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

	if (req.method === 'OPTIONS') {
		return res.status(204).end();
	}

	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
	const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

	if (!clientId || !clientSecret || !refreshToken) {
		return res.status(200).json({
			isPlaying: false,
			message: 'Spotify not configured'
		});
	}

	try {
		const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
			},
			body: new URLSearchParams({
				grant_type: 'refresh_token',
				refresh_token: refreshToken
			})
		});

		const tokenData = await tokenRes.json();
		if (tokenData.error) {
			return res.status(200).json({ isPlaying: false, message: 'Token error' });
		}

		const nowRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
			headers: { Authorization: 'Bearer ' + tokenData.access_token }
		});

		if (nowRes.status === 204 || nowRes.status === 404) {
			return res.status(200).json({ isPlaying: false, message: 'Nothing playing' });
		}

		const data = await nowRes.json();
		const item = data.item;
		if (!item) {
			return res.status(200).json({ isPlaying: false, message: 'Nothing playing' });
		}

		const artists = item.artists.map((a) => a.name).join(', ');
		const title = item.name;

		return res.status(200).json({
			isPlaying: true,
			title,
			artists,
			url: item.external_urls?.spotify
		});
	} catch (e) {
		return res.status(200).json({ isPlaying: false, message: 'Error' });
	}
}
