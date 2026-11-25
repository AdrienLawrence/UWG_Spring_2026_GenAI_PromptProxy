# Prompt Proxy

A classroom project that demonstrates how a browser UI can send structured chat messages to a server-side model API. Choose a persona, adjust the temperature, and submit a prompt to compare responses.

## Run locally

1. Install a current Node.js LTS release and run `npm ci`.
2. Create a local `.env` file with `OPENAI_API_KEY=your_key`.
3. Run `npm run dev` and open `http://localhost:3000`.

The browser builds the message list and sends it to the Express server. The server calls OpenAI and returns the generated text to the page.
