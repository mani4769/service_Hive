# SlotSwapper - Server

This is the backend for the SlotSwapper challenge.

Environment:
- Node 18+
- MongoDB (transactions require replica set or Atlas)

Setup:
1. Copy `.env.example` to `.env` and set values.
2. npm install
3. npm run dev

Notes:
- The swap accept flow uses MongoDB transactions. For local testing, either run a single-node replica set or use MongoDB Atlas.
