# 🎓 FairShare - Academic Contribution Accountability System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A comprehensive college-focused contribution accountability system designed specifically for group projects. Unlike generic project management tools, FairShare records and analyzes **real student participation** rather than just final submissions, providing faculty with objective, auditable proof of individual effort.

## 🌟 Key Features

### Core Functionality
- **📊 Real-Time Activity Tracking** - Every meaningful action is logged with user, timestamp, and context
- **⚡ Smart Effort Scoring** - Quantifies contribution quality (not just quantity)
- **⚠️ Early Warning System** - Identifies inactive members and imbalances during the project
- **📈 Comprehensive Analytics** - Generates grading-ready insights and contribution reports
- **🤝 Peer Feedback Integration** - Cross-checks peer reviews against activity logs
- **🎯 Milestone Management** - Track progress against defined project milestones

### 👨‍🏫 Faculty Features
- Create and manage projects with custom milestones
- Assign student groups with flexible membership
- View real-time contribution analytics dashboard
- Generate comprehensive contribution reports
- Receive automated alerts for at-risk students
- Access detailed activity timelines with filtering
- Export grading-ready data with evidence

### 👨‍🎓 Student Features
- Work within assigned groups seamlessly
- Create and manage tasks with priorities
- Upload files and documents (tracked)
- Add comments and updates (all logged)
- Track personal contribution metrics
- Submit peer feedback with multi-dimensional scoring
- View group activity timeline

## 🚀 Quick Start

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Aayush-sh23/fairshare-academic-system.git
cd fairshare-academic-system

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and set your JWT_SECRET
# JWT_SECRET=your-super-secret-key-here

# Start the server
npm start
```

The server will run on `http://localhost:3000`

### Development Mode

```bash
# Run with auto-reload
npm run dev
```

### First Steps

1. **Register as Faculty**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "professor@university.edu",
    "password": "securepassword",
    "name": "Dr. Jane Smith",
    "role": "faculty"
  }'
```

2. **Create a Project**
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Software Engineering Group Project",
    "description": "Build a web application",
    "start_date": "2024-01-15",
    "end_date": "2024-05-15",
    "milestones": [
      {
        "title": "Requirements Phase",
        "description": "Gather and document requirements",
        "due_date": "2024-02-15",
        "weight": 1.0
      }
    ],
    "groups": [
      {
        "name": "Team Alpha",
        "members": ["student_id_1", "student_id_2"]
      }
    ]
  }'
```

## 📊 Database Schema

### Core Tables (11 Total)

#### Users
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK(role IN ('faculty', 'student')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Activity Logs (CORE FEATURE) ⭐
```sql
CREATE TABLE activity_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  project_id TEXT NOT NULL,
  group_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata TEXT,
  effort_score REAL DEFAULT 1.0,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Other Tables:**
- `projects` - Project definitions and metadata
- `groups` - Student group assignments
- `milestones` - Project deadlines and phases
- `tasks` - Individual assignments
- `comments` - Task discussions
- `peer_feedback` - Peer evaluations
- `alerts` - Early warning system
- `group_members` - Group membership
- `file_uploads` - Document management

## 🔌 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "student"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student"
  },
  "message": "Registration successful"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Projects (Faculty Only)

#### Create Project
```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Project Title",
  "description": "Project description",
  "start_date": "2024-01-15",
  "end_date": "2024-05-15",
  "milestones": [...],
  "groups": [...]
}
```

#### List Projects
```http
GET /api/projects
Authorization: Bearer {token}
```

#### Get Project Details
```http
GET /api/projects/:id
Authorization: Bearer {token}
```

### Tasks (Students)

#### Create Task
```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "group_id": "group-uuid",
  "title": "Implement login feature",
  "description": "Create user authentication",
  "assigned_to": "student-uuid",
  "priority": "high",
  "due_date": "2024-02-01"
}
```

#### Update Task Status
```http
PATCH /api/tasks/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "completed"
}
```

**Status Options:** `todo`, `in_progress`, `review`, `completed`

#### Add Comment
```http
POST /api/tasks/:id/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "I've completed the initial implementation"
}
```

### Analytics (Faculty)

#### Generate Contribution Report
```http
GET /api/analytics/contribution-report/:projectId
Authorization: Bearer {token}
```

**Response:**
```json
{
  "project": {...},
  "groups": [
    {
      "group_id": "uuid",
      "group_name": "Team Alpha",
      "members": [
        {
          "student_name": "Alice Johnson",
          "activity_metrics": {
            "total_effort": 45.5,
            "active_days": 12,
            "tasks_completed": 8
          },
          "peer_feedback": {
            "avg_contribution": 4.2,
            "avg_quality": 4.5
          }
        }
      ],
      "statistics": {
        "avg_effort": 31.75,
        "imbalance_ratio": 2.53
      },
      "issues": [...]
    }
  ]
}
```

#### Get Active Alerts
```http
GET /api/analytics/alerts/:projectId
Authorization: Bearer {token}
```

### Activity Logs

#### Get Project Activity
```http
GET /api/activity/project/:projectId?groupId=&userId=&limit=100
Authorization: Bearer {token}
```

#### Get User Activity Timeline
```http
GET /api/activity/user/:userId/project/:projectId
Authorization: Bearer {token}
```

#### Get Activity Summary
```http
GET /api/activity/summary/project/:projectId
Authorization: Bearer {token}
```

### Peer Feedback

#### Submit Feedback
```http
POST /api/feedback
Authorization: Bearer {token}
Content-Type: application/json

{
  "project_id": "project-uuid",
  "group_id": "group-uuid",
  "reviewee_id": "student-uuid",
  "contribution_score": 4,
  "quality_score": 5,
  "collaboration_score": 4,
  "comments": "Great team player"
}
```

**Scores:** 1-5 scale for each dimension

## 💡 Effort Scoring System

The system uses weighted effort scores to quantify contribution quality:

| Action | Effort Score | Rationale |
|--------|--------------|-----------|
| Create task | 2.0 | Planning and organization |
| Complete task | 5.0 | Actual work completion |
| Update task | 1.5 | Progress tracking |
| Add comment | 1.0 | Communication and collaboration |
| Upload file | 3.0 | Deliverable contribution |

## 📈 Sample Contribution Report

```json
{
  "group": "Team Alpha",
  "members": [
    {
      "name": "Alice Johnson",
      "email": "alice@university.edu",
      "activity_metrics": {
        "total_activities": 45,
        "total_effort": 45.5,
        "avg_effort": 1.01,
        "active_days": 12,
        "first_activity": "2024-01-15T10:00:00Z",
        "last_activity": "2024-02-10T15:30:00Z",
        "creates": 8,
        "updates": 25,
        "comments": 12
      },
      "peer_feedback": {
        "avg_contribution": 4.2,
        "avg_quality": 4.5,
        "avg_collaboration": 4.3,
        "feedback_count": 3
      }
    },
    {
      "name": "Bob Smith",
      "email": "bob@university.edu",
      "activity_metrics": {
        "total_activities": 15,
        "total_effort": 18.0,
        "avg_effort": 1.2,
        "active_days": 4,
        "first_activity": "2024-01-20T14:00:00Z",
        "last_activity": "2024-01-28T11:00:00Z",
        "creates": 2,
        "updates": 8,
        "comments": 5
      },
      "peer_feedback": {
        "avg_contribution": 2.8,
        "avg_quality": 3.1,
        "avg_collaboration": 3.0,
        "feedback_count": 3
      }
    }
  ],
  "statistics": {
    "avg_effort": 31.75,
    "max_effort": 45.5,
    "min_effort": 18.0,
    "effort_variance": 27.5,
    "imbalance_ratio": 2.53
  },
  "issues": [
    {
      "student": "Bob Smith",
      "type": "low_contribution",
      "severity": "high",
      "message": "Bob Smith has significantly lower contribution (18.0 vs avg 31.8)"
    },
    {
      "student": "Bob Smith",
      "type": "dormant",
      "severity": "high",
      "message": "Bob Smith has been inactive for 13 days"
    }
  ]
}
```

## 🎯 Key Differentiators

### vs GitHub
- ✅ Works for **non-technical projects** (essays, presentations, research)
- ✅ **Academic-focused metrics** and reporting
- ✅ **Peer feedback integration** with cross-validation
- ✅ **Faculty-oriented grading** insights

### vs Trello/Asana
- ✅ **Comprehensive activity logging** (not just task completion)
- ✅ **Effort scoring system** (quality over quantity)
- ✅ **Early warning alerts** during project (not after)
- ✅ **Grading-ready analytics** with evidence

### vs LMS Platforms
- ✅ **Real-time contribution tracking** (not just final submissions)
- ✅ **Detailed activity timelines** with context
- ✅ **Imbalance detection** and automated alerts
- ✅ **Evidence-based evaluation** with audit trails

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth with 7-day expiry
- **Role-Based Access Control**: Faculty vs Student permissions
- **SQL Injection Prevention**: Parameterized queries
- **Input Validation**: Server-side validation for all inputs

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: SQLite (Better-SQLite3) - easily upgradeable to PostgreSQL/MySQL
- **Authentication**: JWT + Bcrypt
- **Architecture**: RESTful API
- **Code Style**: ES6+ with async/await

## 📝 Usage Examples

### Faculty Workflow

```javascript
// 1. Register as faculty
POST /api/auth/register
{
  "email": "prof@university.edu",
  "password": "secure123",
  "name": "Dr. Jane Smith",
  "role": "faculty"
}

// 2. Create project with milestones
POST /api/projects
{
  "title": "Web Development Project",
  "start_date": "2024-01-15",
  "end_date": "2024-05-15",
  "milestones": [
    {
      "title": "Phase 1: Planning",
      "due_date": "2024-02-15"
    }
  ],
  "groups": [
    {
      "name": "Team Alpha",
      "members": ["student1_id", "student2_id"]
    }
  ]
}

// 3. Monitor activity
GET /api/activity/project/{projectId}

// 4. Generate report
GET /api/analytics/contribution-report/{projectId}

// 5. Review alerts
GET /api/analytics/alerts/{projectId}
```

### Student Workflow

```javascript
// 1. Register as student
POST /api/auth/register
{
  "email": "student@university.edu",
  "password": "secure123",
  "name": "John Doe",
  "role": "student"
}

// 2. View assigned projects
GET /api/projects

// 3. Create task
POST /api/tasks
{
  "group_id": "group_uuid",
  "title": "Design database schema",
  "assigned_to": "student_uuid",
  "priority": "high"
}

// 4. Update task status
PATCH /api/tasks/{taskId}/status
{
  "status": "completed"
}

// 5. Add comment
POST /api/tasks/{taskId}/comments
{
  "content": "Completed the schema design"
}

// 6. Submit peer feedback
POST /api/feedback
{
  "project_id": "project_uuid",
  "reviewee_id": "peer_uuid",
  "contribution_score": 4,
  "quality_score": 5,
  "collaboration_score": 4
}
```

## 🚧 Roadmap & Future Enhancements

- [ ] Real-time notifications via WebSocket
- [ ] File version control and diff viewing
- [ ] Advanced analytics dashboard with charts
- [ ] Export reports to CSV/PDF
- [ ] Integration with popular LMS platforms (Canvas, Moodle)
- [ ] Mobile app (React Native)
- [ ] AI-powered contribution analysis
- [ ] Automated plagiarism detection for submissions
- [ ] Video conferencing integration
- [ ] Calendar integration (Google Calendar, Outlook)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/Aayush-sh23/fairshare-academic-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Aayush-sh23/fairshare-academic-system/discussions)
- **Email**: support@fairshare.edu (for enterprise inquiries)

## 🙏 Acknowledgments

- Inspired by the need for fair evaluation in academic group projects
- Built with modern web technologies and best practices
- Designed with input from educators and students

## 📊 Project Stats

- **Lines of Code**: ~2,500+
- **API Endpoints**: 25+
- **Database Tables**: 11
- **Test Coverage**: Coming soon
- **Documentation**: Comprehensive

---

**Built for fairness. Designed for education. Powered by evidence.**

🌟 **Star this repository if you find it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/Aayush-sh23/fairshare-academic-system?style=social)](https://github.com/Aayush-sh23/fairshare-academic-system/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Aayush-sh23/fairshare-academic-system?style=social)](https://github.com/Aayush-sh23/fairshare-academic-system/network/members)

---

Made with ❤️ for educators and students worldwide