# Qrowd

A live Q&A platform for events, classrooms, and team meetings. Hosts create a room and share a link; attendees ask questions anonymously and upvote the ones they care about most, so the best questions rise to the top.

**Live demo:** [your-vercel-url-here]

## Features

- Secure host accounts
- Instant, shareable rooms
- Anonymous participation — no account needed to ask or vote
- Live moderation — pin, mark answered, hide, or delete questions
- Open, close, or delete a room anytime

## Tech Stack

React (Vite), Tailwind CSS, Node.js, Express, MongoDB

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas account

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/qrowd.git
cd qrowd
cd server && npm install
cd ../client && npm install
```

### Environment Variables

Create a `.env` in `server/` (see `.env.example`) and a `.env` in `client/` with your own values. These files are not committed to version control.

### Running Locally

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Visit `http://localhost:5173`.

