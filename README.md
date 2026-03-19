# Portfolio Backend - AI Chat Service 🚀

This is the backend service for **Mayank Singh's Portfolio Website**. It powers the AI chat interface, allowing visitors to interact with a personalized AI persona that represents Mayank, his skills, projects, and professional background.

## 🌟 Features

- **AI-Powered Chat:** Integrates with OpenRouter to provide real-time, streaming AI responses.
- **Server-Sent Events (SSE):** Supports streaming responses for a smooth, modern UI experience.
- **Personalized Persona:** Uses a custom system prompt to maintain a consistent "Mayank Singh" identity.
- **Secure Integration:** Keeps sensitive API keys hidden from the frontend.
- **CORS Configured:** Securely handles requests from verified origins (Vercel, Localhost).
- **MERN Stack Ready:** Built with Node.js and Express.js, designed to complement a React-based frontend.

## 🛠️ Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **API Client:** [Axios](https://axios-http.com/)
- **AI Gateway:** [OpenRouter](https://openrouter.ai/)
- **Environment Management:** [dotenv](https://github.com/motdotla/dotenv)
- **Development Helper:** [Nodemon](https://nodemon.io/)

## 🚀 Getting Started

### Prerequisites

- Node.js installed on your machine.
- An [OpenRouter API Key](https://openrouter.ai/keys).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mayank332k/portfolio_backend.git
   cd portfolio_backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   OPENROUTER_API_KEY=your_api_key_here
   ```

4. **Run the server:**
   ```bash
   # For development (with nodemon)
   npm start
   ```

## 🔌 API Endpoints

### `POST /api/chat`
Handles incoming chat messages and streams back AI responses.

**Request Body:**
```json
{
  "message": "Hi Mayank, tell me about your projects."
}
```

**Response:**
Streams `text/event-stream` with characters as they are generated.

## 👤 About Mayank

I'm a Computer Science student (Batch 2024-2027) at Jnan Vikas Mandal's Mehata Degree College, focused on Full Stack Development and AI integration.

- **Email:** [singhmayank4146@gmail.com](mailto:singhmayank4146@gmail.com)
- **LinkedIn:** [Mayank Singh](https://www.linkedin.com/in/mayank-singh-813b68373/)
- **GitHub:** [@Mayank332k](https://github.com/Mayank332k)
- **Instagram:** [_mayvnk.ug](https://www.instagram.com/_mayvnk.ug?igsh=ZTIwa3VjdDJkZTY4)

## 📄 License
This project is licensed under the ISC License.
