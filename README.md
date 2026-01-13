# 🎓 FairShare - Academic Contribution Accountability System

A comprehensive college-focused contribution accountability system designed specifically for group projects. Unlike generic project management tools, FairShare records and analyzes **real student participation** rather than just final submissions, providing faculty with objective, auditable proof of individual effort.

## 🌟 Key Features

### Core Functionality
- **Real-Time Activity Tracking** - Every meaningful action is logged with user, timestamp, and context
- **Smart Effort Scoring** - Quantifies contribution quality (not just quantity)
- **Early Warning System** - Identifies inactive members and imbalances during the project
- **Comprehensive Analytics** - Generates grading-ready insights and contribution reports
- **Peer Feedback Integration** - Cross-checks peer reviews against activity logs
- **Milestone Management** - Track progress against defined project milestones

### 👨‍🏫 Faculty Features
- Create and manage projects with custom milestones
- Assign student groups
- View real-time contribution analytics
- Generate comprehensive contribution reports
- Receive automated alerts for at-risk students
- Access detailed activity timelines
- Export grading-ready data

### 👨‍🎓 Student Features
- Work within assigned groups
- Create and manage tasks
- Upload files and documents
- Add comments and updates
- Track personal contribution metrics
- Submit peer feedback
- View group activity timeline

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Aayush-sh23/fairshare-academic-system.git
cd fairshare-academic-system

# Install dependencies
npm install

# Start the server
npm start
```

The server will run on `http://localhost:3000`

### Development Mode

```bash
npm run dev
```

## 📊 Database Schema

### Core Tables (11 Total)

- **users** - Faculty and student accounts
- **projects** - Project definitions and metadata
- **groups** - Student group assignments
- **milestones** - Project deadlines and phases
- **tasks** - Individual assignments
- **activity_logs** - ⭐ CORE: Comprehensive activity tracking
- **comments** - Task discussions
- **peer_feedback** - Peer evaluations
- **alerts** - Early warning system
- **group_members** - Group membership
- **file_uploads** - Document management

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register - Register new user (faculty/student)
POST /api/auth/login - Login and receive JWT token
```

### Projects (Faculty Only)
```
POST /api/projects - Create project with milestones and groups
GET /api/projects - List all projects for current user
GET /api/projects/:id - Get detailed project information
GET /api/projects/students/list - Get all students for assignment
```

### Tasks (Students)
```
POST /api/tasks - Create new task with assignment
GET /api/tasks/group/:groupId - List all tasks for group
PATCH /api/tasks/:id/status - Update task status (logs activity)
POST /api/tasks/:id/comments - Add comment to task
GET /api/tasks/:id/comments - Get all task comments
```

### Analytics (Faculty)
```
GET /api/analytics/contribution-report/:projectId - Generate comprehensive report
GET /api/analytics/alerts/:projectId - Get active alerts
PATCH /api/analytics/alerts/:alertId/resolve - Resolve alert
```

### Activity Logs
```
GET /api/activity/project/:projectId - View activity logs
GET /api/activity/user/:userId/project/:projectId - User activity timeline
GET /api/activity/summary/project/:projectId - Activity summary statistics
```

### Peer Feedback
```
POST /api/feedback - Submit peer review (students)
GET /api/feedback/project/:projectId - View all feedback (faculty only)
GET /api/feedback/student/:studentId/project/:projectId - Get student feedback summary
```

## 💡 Effort Scoring System

The system uses weighted effort scores to quantify contribution quality:

- **Create task**: 2.0
- **Complete task**: 5.0
- **Update task**: 1.5
- **Add comment**: 1.0
- **Upload file**: 3.0

## 📈 Sample Contribution Report

```json
{
  "group": "Team Alpha",
  "members": [
    {
      "name": "Alice Johnson",
      "total_effort": 45.5,
      "active_days": 12,
      "tasks_completed": 8,
      "peer_avg_contribution": 4.2,
      "status": "✅ Strong contributor"
    },
    {
      "name": "Bob Smith",
      "total_effort": 18.0,
      "active_days": 4,
      "tasks_completed": 2,
      "issues": [
        "⚠️ Low contribution (60% below average)",
        "⚠️ Inactive for 9 days"
      ]
    }
  ],
  "statistics": {
    "avg_effort": 31.75,
    "imbalance_ratio": 2.53
  }
}
```

## 🎯 Key Differentiators

### vs GitHub
- ✅ Works for non-technical projects (essays, presentations, research)
- ✅ Academic-focused metrics and reporting
- ✅ Peer feedback integration
- ✅ Faculty-oriented grading insights

### vs Trello/Asana
- ✅ Comprehensive activity logging (not just task completion)
- ✅ Effort scoring system (quality over quantity)
- ✅ Early warning alerts during project
- ✅ Grading-ready analytics

### vs LMS Platforms
- ✅ Real-time contribution tracking (not just final submissions)
- ✅ Detailed activity timelines with context
- ✅ Imbalance detection and alerts
- ✅ Evidence-based evaluation

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- SQL injection prevention
- Input validation

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (Better-SQLite3)
- **Authentication**: JWT + Bcrypt
- **Architecture**: RESTful API

## 📝 Usage Example

### Faculty Workflow

1. Register as faculty member
2. Create a project with milestones (e.g., "Research Phase - Due March 15")
3. Create groups and assign students
4. Monitor real-time activity dashboard
5. Review automated alerts for at-risk students
6. Generate comprehensive contribution reports
7. Use objective data for fair grading

### Student Workflow

1. Register as student
2. View assigned projects and group members
3. Create tasks and assign to team members
4. Update task status (todo → in_progress → review → completed)
5. Upload files and add comments (all logged)
6. Submit peer feedback at project end
7. View personal contribution metrics

## 🚧 Future Enhancements

- Real-time notifications
- File version control
- Advanced analytics dashboard
- Export to CSV/PDF
- Integration with LMS platforms
- Mobile app
- AI-powered contribution analysis

## 📄 License

MIT License - Free for educational use

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on the repository.

---

**Built for fairness. Designed for education. Powered by evidence.**

🌟 Star this repository if you find it helpful!