# CAID Terminal Website - Backend Integration Contracts

## Overview
Transform the current mock-based terminal interface into a full-stack application with dynamic content management, analytics, and investor inquiry handling.

## Current Mock Data Structure (frontend/src/data/mock.js)
```javascript
- system: {version, status, welcomeMessage}
- about: {name, mission, description, urgency}
- roadmap: {milestones[]}
- team: {founders[]}
- funding: {stage, target, focus, market, seeking[]}
- contact: {email, demo, pitch}
- commands: [{command, description}]
```

## Backend API Contracts

### 1. Company Information Management
```
GET /api/company/info
- Returns: system info, about, contact details
- Purpose: Dynamic company information updates

POST /api/company/info (Admin only - future feature)
- Updates: company information
- Body: {about, contact, system}
```

### 2. Roadmap Management
```
GET /api/roadmap
- Returns: {milestones: [{id, target, product, function, status, createdAt}]}
- Purpose: Dynamic roadmap updates

POST /api/roadmap/milestone (Admin only - future feature)
- Creates: new milestone
- Body: {target, product, function, status}

PUT /api/roadmap/milestone/:id (Admin only - future feature)
- Updates: existing milestone
- Body: {target, product, function, status}
```

### 3. Team Management
```
GET /api/team
- Returns: {founders: [{name, role, focus, bio?, image?, linkedIn?}]}
- Purpose: Dynamic team information

POST /api/team/member (Admin only - future feature)
- Adds: team member
- Body: {name, role, focus, bio, image, linkedIn}
```

### 4. Terminal Analytics
```
POST /api/analytics/command
- Tracks: command usage for insights
- Body: {command, timestamp, sessionId, userAgent}
- Purpose: Understand user engagement

GET /api/analytics/dashboard (Admin only - future feature)
- Returns: command usage statistics, popular commands, user engagement
```

### 5. Investor Inquiries
```
POST /api/inquiries
- Creates: investor/contact inquiry
- Body: {name, email, company?, message, inquiryType: 'funding'|'demo'|'general'}
- Purpose: Capture investor interest

GET /api/inquiries (Admin only - future feature)
- Returns: list of inquiries
- Purpose: Investor relationship management
```

### 6. Dynamic Command Responses
```
GET /api/commands/:commandName
- Returns: formatted response for specific commands
- Purpose: Server-side command processing with dynamic content
```

## MongoDB Collections

### 1. company_info
```javascript
{
  _id: ObjectId,
  about: {
    name: String,
    mission: String,
    description: String,
    urgency: String
  },
  contact: {
    email: String,
    demo: String,
    pitch: String
  },
  system: {
    version: String,
    status: String,
    welcomeMessage: String
  },
  updatedAt: Date,
  createdAt: Date
}
```

### 2. roadmap_milestones
```javascript
{
  _id: ObjectId,
  target: String, // "SEP 2025"
  product: String,
  function: String,
  status: String, // "In Development", "R&D Phase", "Completed"
  priority: Number, // for ordering
  createdAt: Date,
  updatedAt: Date
}
```

### 3. team_members
```javascript
{
  _id: ObjectId,
  name: String,
  role: String,
  focus: String,
  bio: String,
  image: String, // URL to profile image
  linkedIn: String,
  isFounder: Boolean,
  displayOrder: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. terminal_analytics
```javascript
{
  _id: ObjectId,
  command: String,
  timestamp: Date,
  sessionId: String,
  userAgent: String,
  ipAddress: String, // for analytics (anonymized)
  responseTime: Number // ms
}
```

### 5. investor_inquiries
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  company: String,
  message: String,
  inquiryType: String, // 'funding', 'demo', 'general'
  status: String, // 'new', 'contacted', 'scheduled', 'closed'
  source: String, // 'terminal_website'
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Integration Plan

### 1. Remove Mock Data Dependencies
- Replace `import mockData from './data/mock.js'` with API calls
- Update Terminal.js to use backend APIs
- Add loading states and error handling

### 2. API Integration Points
```javascript
// Terminal.js modifications needed:

// Replace static commands object with:
useEffect(() => {
  fetchCompanyInfo();
  fetchRoadmap();
  fetchTeam();
}, []);

// Command execution becomes:
const executeCommand = async (command) => {
  // Track command usage
  await trackCommand(command);
  
  // Fetch dynamic responses
  const response = await fetchCommandResponse(command);
  // ... rest of execution logic
};
```

### 3. New Components Needed
- `LoadingSpinner.js` - For command execution states
- `ErrorBoundary.js` - For API error handling
- `ContactForm.js` - Embedded in contact command response

### 4. Enhanced Commands
- `contact` command will show an embedded form for investor inquiries
- `roadmap` will display real-time milestone updates
- `team` will show dynamic team information
- New `demo` command for scheduling demo requests

## Backend Implementation Priority

### Phase 1: Core APIs (Current Sprint)
1. Company info endpoints
2. Roadmap endpoints  
3. Team endpoints
4. Basic terminal analytics
5. Frontend integration

### Phase 2: Enhanced Features (Future)
1. Investor inquiry management
2. Admin dashboard for content management
3. Real-time analytics
4. Email notifications for inquiries

## Security Considerations
- Rate limiting on public APIs
- Input validation and sanitization
- CORS configuration for terminal domain
- Analytics data anonymization
- Admin authentication (future feature)

## Success Metrics
- Command usage tracking
- Investor inquiry conversion rate
- Terminal session duration
- Popular command identification
- User engagement patterns