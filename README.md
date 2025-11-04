# SlotSwapper - Peer-to-Peer Time Slot Scheduling Application

A modern, full-stack web application that enables users to swap time slots with each other. Built as part of the ServiceHive Full Stack Intern technical challenge.

## 🌟 Project Overview

SlotSwapper is a peer-to-peer scheduling platform where users can:
- Create and manage their calendar events
- Mark events as "swappable" 
- Browse available slots from other users
- Send swap requests to exchange time slots
- Accept or reject incoming swap requests

The core concept: Users have busy calendar slots that they can make available for swapping. Other users can request to exchange one of their own swappable slots, creating a peer-to-peer marketplace for time slots.

## 🏗️ Architecture & Design Choices

### Backend (Node.js + Express + MongoDB)
- **Express.js**: RESTful API with clean route separation
- **MongoDB + Mongoose**: Document-based storage with schema validation
- **JWT Authentication**: Stateless token-based auth
- **bcryptjs**: Password hashing for security
- **Transactional Swaps**: MongoDB transactions ensure atomic slot exchanges

### Frontend (React + Vite)
- **React 18**: Modern functional components with hooks
- **Vite**: Fast development server and build tool
- **React Router**: Client-side routing with protected routes
- **Context API**: Global auth state management
- **Axios**: HTTP client for API calls
- **Modern CSS**: Professional UI with gradients, cards, and animations

### Key Design Decisions
1. **MongoDB Transactions**: Ensures swap operations are atomic - either both slots exchange owners or neither do
2. **Status Management**: Three event states (BUSY, SWAPPABLE, SWAP_PENDING) prevent double-booking
3. **React Context**: Lightweight state management for auth without Redux complexity
4. **Modal-based UX**: Swap requests use modals for better user experience
5. **Optimistic Updates**: UI updates immediately with API confirmation

## 🚀 Local Setup Instructions

### Prerequisites
- **Node.js 18+** 
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/mani4769/service_Hive.git
cd service_Hive
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create environment file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
```

**MongoDB Setup Options:**

**Option A: Local MongoDB**
```bash
# Install MongoDB locally, then start it
mongod
```

**Option B: MongoDB Atlas (Recommended)**
1. Create free account at https://mongodb.com/atlas
2. Create a cluster and get connection string
3. Replace `MONGO_URI` in `.env` with your Atlas connection string

**Option C: Local Replica Set (for transactions)**
```bash
# Start MongoDB with replica set (required for transactions)
mongod --replSet rs0
# In mongo shell:
rs.initiate()
```

Seed the database with test data:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```
Server will run on http://localhost:4000

### 3. Frontend Setup
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
Frontend will run on http://localhost:5173

### 4. Test the Application
1. Open http://localhost:5173
2. Sign up with a new account or use test credentials:
   - Alice: `alice@example.com` / `password123`
   - Bob: `bob@example.com` / `password123`
   - Carol: `carol@example.com` / `password123`

## 📋 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/auth/signup` | Create new user account | `{name, email, password}` | `{token, user}` |
| POST | `/api/auth/login` | Authenticate user | `{email, password}` | `{token, user}` |

### Events/Calendar Endpoints
*All require `Authorization: Bearer <token>` header*

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/events` | Get current user's events | - | `[{events}]` |
| POST | `/api/events` | Create new event | `{title, startTime, endTime, status?}` | `{event}` |
| PUT | `/api/events/:id` | Update event (owner only) | `{title?, startTime?, endTime?, status?}` | `{event}` |
| DELETE | `/api/events/:id` | Delete event (owner only) | - | `{message}` |

### Marketplace & Swap Endpoints
*All require `Authorization: Bearer <token>` header*

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/swappable-slots` | Get all swappable slots from other users | - | `[{slots}]` |
| POST | `/api/swap-request` | Request to swap slots | `{mySlotId, theirSlotId}` | `{swapRequest}` |
| POST | `/api/swap-response/:id` | Accept/reject swap request | `{accepted: boolean}` | `{swapRequest}` |
| GET | `/api/swap-requests/me` | Get user's swap requests | - | `{incoming, outgoing}` |

### Example API Usage

**Create Event:**
```bash
curl -X POST http://localhost:4000/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Team Meeting",
    "startTime": "2025-11-06T10:00:00Z",
    "endTime": "2025-11-06T11:00:00Z",
    "status": "SWAPPABLE"
  }'
```

**Request Swap:**
```bash
curl -X POST http://localhost:4000/api/swap-request \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mySlotId": "USER_SLOT_ID",
    "theirSlotId": "TARGET_SLOT_ID"
  }'
```

## 🧠 Key Features Implemented

### Core Requirements ✅
- [x] **User Authentication**: JWT-based signup/login
- [x] **Calendar Management**: CRUD operations for events
- [x] **Swap Logic**: Transactional slot exchanges
- [x] **Marketplace**: Browse available swappable slots
- [x] **Request Management**: Send/receive/respond to swap requests
- [x] **State Management**: Reactive UI with protected routes

### Advanced Features ✅
- [x] **Professional UI**: Modern design with animations
- [x] **Modal Interface**: Intuitive swap request flow
- [x] **Test Data**: Comprehensive seed script
- [x] **Error Handling**: Graceful error states
- [x] **Loading States**: Better user experience
- [x] **Responsive Design**: Mobile-friendly interface

## 🔧 Technical Challenges & Solutions

### Challenge 1: Atomic Swap Operations
**Problem**: Ensuring both slots exchange owners simultaneously without race conditions.

**Solution**: MongoDB transactions with session-based operations. The swap acceptance logic:
1. Starts a transaction
2. Verifies both slots are still SWAP_PENDING
3. Exchanges the ownerId fields atomically
4. Updates both statuses to BUSY
5. Commits or rolls back on error

### Challenge 2: State Synchronization
**Problem**: UI not updating after login/swap operations.

**Solution**: React Context API for auth state management and API response-driven UI updates. Components re-render when auth token changes.

### Challenge 3: Transaction Requirements
**Problem**: MongoDB transactions require replica sets, complex for local development.

**Solution**: Documented multiple MongoDB setup options (standalone, Atlas, local replica set) with clear instructions for each.

### Challenge 4: Professional UI Design
**Problem**: Creating a polished, production-ready interface.

**Solution**: Implemented comprehensive CSS system with:
- CSS custom properties for consistent theming
- Card-based layouts with proper spacing
- Professional color scheme and typography
- Hover animations and loading states
- Responsive design patterns

## 📝 Assumptions Made

1. **Time Zones**: All times stored in UTC, displayed in user's local timezone
2. **Slot Validation**: No overlap checking - users manage their own calendar conflicts
3. **Authentication**: JWT stored in localStorage (production would use httpOnly cookies)
4. **Swap Finality**: Accepted swaps are permanent (no undo functionality)
5. **User Trust**: Users are trusted to honor swapped commitments
6. **Concurrent Requests**: Only one pending request per slot at a time
7. **Event Types**: All events are treated equally regardless of importance

## 🗂️ Project Structure

```
service_Hive/
├── server/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── utils/          # DB connection
│   │   ├── seed.js         # Test data script
│   │   └── index.js        # App entry point
│   ├── package.json
│   └── .env.example
│
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Route components
│   │   ├── auth.js         # Auth context
│   │   ├── api.js          # API client
│   │   ├── styles.css      # Global styles
│   │   └── main.jsx        # App entry point
│   ├── package.json
│   └── index.html
│
└── README.md              # This file
```

## 🧪 Testing

### Manual Testing Workflow
1. **Authentication Flow**:
   - Sign up new user → should redirect to dashboard
   - Login existing user → should redirect to dashboard
   - Access protected routes without token → should redirect to login

2. **Event Management**:
   - Create event → should appear in dashboard
   - Toggle swappable status → should update immediately
   - Delete event → should remove from list

3. **Swap Flow**:
   - Browse marketplace → should show other users' swappable slots
   - Request swap → should open modal, send request
   - Accept/reject → should exchange slots or revert status

### Test Data Available
- 3 users with realistic names and events
- 10 total events (7 swappable, 3 busy)
- Various event types: meetings, focus blocks, workshops
- Future timestamps for testing

## 🚀 Future Enhancements

- **Real-time Notifications**: WebSocket integration for instant updates
- **Calendar View**: Visual calendar interface instead of list view
- **Time Conflict Detection**: Prevent overlapping events
- **Swap History**: Track all completed swaps
- **User Profiles**: Enhanced user information and preferences
- **Mobile App**: React Native implementation
- **Email Notifications**: Notify users of swap requests via email

## 🛠️ Development Commands

**Backend:**
```bash
npm run dev        # Start development server
npm run start      # Start production server
npm run seed       # Populate test data
```

**Frontend:**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 📞 Support

For questions about this implementation:
- Review the code comments for detailed explanations
- Check the browser console for client-side errors
- Check the server terminal for backend errors
- Ensure MongoDB is running and accessible

---

**Built with ❤️ for ServiceHive Technical Challenge**

*This application demonstrates full-stack development skills including modern React patterns, RESTful API design, database transactions, authentication, and professional UI/UX design.*