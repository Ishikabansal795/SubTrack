# SubTrack – client

    cp .env.example .env     # set VITE_API_URL to Ishika's server
    npm install
    npm run dev              # http://localhost:5173

Routes: /login, /register, /dashboard (protected).
Backend contract expected:
- POST /register  {name,email,password,timezone} -> 201 (token optional); 409 if email exists
- POST /login     {email,password} -> {token, user:{name,email}}; 400/401 on wrong credentials
Change the URLs in src/api/auth.js if paths differ. Server needs CORS for http://localhost:5173.
Any other page: use `import api from "../api/axios"` – the JWT header is added automatically.
