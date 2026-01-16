# FairShare API Documentation

Complete API reference for the FairShare Academic Contribution Accountability System.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication via JWT token.

Include the token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Authentication Endpoints

### Register User

Create a new user account (faculty or student).

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "student"
}
```

**Parameters:**
- `email` (string, required): Valid email address
- `password` (string, required): Minimum 6 characters
- `name` (string, required): Full name
- `role` (string, required): Either "faculty" or "student"

**Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student"
  },
  "message": "Registration successful"
}
```

**Error Responses:**
- `400 Bad Request`: Missing fields or invalid role
- `400 Bad Request`: Email already exists
- `500 Internal Server Error`: Server error

---

### Login

Authenticate and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student"
  },
  "message": "Login successful"
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

---

## Project Endpoints

### Create Project

Create a new project with milestones and groups. **Faculty only**.

**Endpoint:** `POST /projects`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Software Engineering Project",
  "description": "Build a web application",
  "start_date": "2024-01-15",
  "end_date": "2024-05-15",
  "milestones": [
    {
      "title": "Requirements Phase",
      "description": "Gather requirements",
      "due_date": "2024-02-15",
      "weight": 1.0
    }
  ],
  "groups": [
    {
      "name": "Team Alpha",
      "members": ["student-uuid-1", "student-uuid-2"]
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": "project-uuid",
  "message": "Project created successfully",
  "project": {
    "id": "project-uuid",
    "title": "Software Engineering Project",
    "start_date": "2024-01-15",
    "end_date": "2024-05-15"
  }
}
```

---

### List Projects

Get all projects for the current user.

**Endpoint:** `GET /projects`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:** `200 OK`
```json
[
  {
    "id": "project-uuid",
    "title": "Software Engineering Project",
    "description": "Build a web application",
    "faculty_id": "faculty-uuid",
    "start_date": "2024-01-15",
    "end_date": "2024-05-15",
    "status": "active",
    "created_at": "2024-01-10T10:00:00Z"
  }
]
```

---

### Get Project Details

Get detailed information about a specific project.

**Endpoint:** `GET /projects/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:** `200 OK`
```json
{
  "id": "project-uuid",
  "title": "Software Engineering Project",
  "description": "Build a web application",
  "faculty_id": "faculty-uuid",
  "start_date": "2024-01-15",
  "end_date": "2024-05-15",
  "status": "active",
  "created_at": "2024-01-10T10:00:00Z",
  "milestones": [
    {
      "id": "milestone-uuid",
      "project_id": "project-uuid",
      "title": "Requirements Phase",
      "description": "Gather requirements",
      "due_date": "2024-02-15",
      "weight": 1.0,
      "created_at": "2024-01-10T10:00:00Z"
    }
  ],
  "groups": [
    {
      "id": "group-uuid",
      "name": "Team Alpha",
      "members": [
        {
          "id": "student-uuid-1",
          "name": "Alice Johnson",
          "email": "alice@university.edu"
        },
        {
          "id": "student-uuid-2",
          "name": "Bob Smith",
          "email": "bob@university.edu"
        }
      ]
    }
  ]
}
```

---

### Get Students List

Get all students for assignment. **Faculty only**.

**Endpoint:** `GET /projects/students/list`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:** `200 OK`
```json
[
  {
    "id": "student-uuid-1",
    "name": "Alice Johnson",
    "email": "alice@university.edu"
  },
  {
    "id": "student-uuid-2",
    "name": "Bob Smith",
    "email": "bob@university.edu"
  }
]
```

---

## Task Endpoints

### Create Task

Create a new task in a group.

**Endpoint:** `POST /tasks`

**Request Body:**
```json
{
  "group_id": "group-uuid",
  "milestone_id": "milestone-uuid",
  "title": "Implement login feature",
  "description": "Create user authentication system",
  "assigned_to": "student-uuid",
  "priority": "high",
  "due_date": "2024-02-01"
}
```

**Parameters:**
- `group_id` (string, required): Group UUID
- `milestone_id` (string, optional): Milestone UUID
- `title` (string, required): Task title
- `description` (string, optional): Task description
- `assigned_to` (string, optional): Student UUID
- `priority` (string, optional): "low", "medium", or "high" (default: "medium")
- `due_date` (string, optional): ISO date format

**Response:** `201 Created`
```json
{
  "id": "task-uuid",
  "message": "Task created successfully",
  "task": {
    "id": "task-uuid",
    "title": "Implement login feature",
    "status": "todo"
  }
}
```

**Activity Logged:** Creates activity log with effort_score: 2.0

---

### Get Group Tasks

Get all tasks for a specific group.

**Endpoint:** `GET /tasks/group/:groupId`

**Response:** `200 OK`
```json
[
  {
    "id": "task-uuid",
    "group_id": "group-uuid",
    "milestone_id": "milestone-uuid",
    "title": "Implement login feature",
    "description": "Create user authentication system",
    "assigned_to": "student-uuid",
    "assigned_to_name": "Alice Johnson",
    "status": "in_progress",
    "priority": "high",
    "due_date": "2024-02-01",
    "created_by": "student-uuid-2",
    "created_by_name": "Bob Smith",
    "created_at": "2024-01-15T10:00:00Z",
    "completed_at": null
  }
]
```

---

### Update Task Status

Update the status of a task.

**Endpoint:** `PATCH /tasks/:id/status`

**Request Body:**
```json
{
  "status": "completed"
}
```

**Status Options:**
- `todo`
- `in_progress`
- `review`
- `completed`

**Response:** `200 OK`
```json
{
  "message": "Task status updated successfully",
  "status": "completed"
}
```

**Activity Logged:** 
- Status "completed": effort_score: 5.0
- Other statuses: effort_score: 1.5

---

### Add Comment to Task

Add a comment to a task.

**Endpoint:** `POST /tasks/:id/comments`

**Request Body:**
```json
{
  "content": "I've completed the initial implementation"
}
```

**Response:** `201 Created`
```json
{
  "id": "comment-uuid",
  "message": "Comment added successfully"
}
```

**Activity Logged:** effort_score: 1.0

---

### Get Task Comments

Get all comments for a task.

**Endpoint:** `GET /tasks/:id/comments`

**Response:** `200 OK`
```json
[
  {
    "id": "comment-uuid",
    "task_id": "task-uuid",
    "user_id": "student-uuid",
    "user_name": "Alice Johnson",
    "user_email": "alice@university.edu",
    "content": "I've completed the initial implementation",
    "created_at": "2024-01-20T14:30:00Z"
  }
]
```

---

## Activity Endpoints

### Get Project Activity

Get activity logs for a project with optional filtering.

**Endpoint:** `GET /activity/project/:projectId`

**Query Parameters:**
- `groupId` (string, optional): Filter by group
- `userId` (string, optional): Filter by user
- `startDate` (string, optional): ISO date format
- `endDate` (string, optional): ISO date format
- `limit` (number, optional): Max results (default: 100)

**Response:** `200 OK`
```json
[
  {
    "id": "activity-uuid",
    "user_id": "student-uuid",
    "user_name": "Alice Johnson",
    "user_email": "alice@university.edu",
    "project_id": "project-uuid",
    "group_id": "group-uuid",
    "activity_type": "update",
    "entity_type": "task",
    "entity_id": "task-uuid",
    "description": "Updated task status to: completed",
    "metadata": "{\"old_status\":\"in_progress\",\"new_status\":\"completed\"}",
    "effort_score": 5.0,
    "timestamp": "2024-01-20T15:00:00Z"
  }
]
```

---

### Get User Activity Timeline

Get activity timeline for a specific user in a project.

**Endpoint:** `GET /activity/user/:userId/project/:projectId`

**Response:** `200 OK`
```json
[
  {
    "id": "activity-uuid",
    "user_id": "student-uuid",
    "user_name": "Alice Johnson",
    "activity_type": "create",
    "entity_type": "task",
    "description": "Created task: Implement login feature",
    "effort_score": 2.0,
    "timestamp": "2024-01-15T10:00:00Z"
  }
]
```

---

### Get Activity Summary

Get aggregated activity statistics for a project.

**Endpoint:** `GET /activity/summary/project/:projectId`

**Response:** `200 OK`
```json
[
  {
    "user_id": "student-uuid-1",
    "user_name": "Alice Johnson",
    "activity_count": 45,
    "total_effort": 67.5,
    "first_activity": "2024-01-15T10:00:00Z",
    "last_activity": "2024-02-10T15:30:00Z",
    "active_days": 12
  },
  {
    "user_id": "student-uuid-2",
    "user_name": "Bob Smith",
    "activity_count": 18,
    "total_effort": 25.0,
    "first_activity": "2024-01-20T14:00:00Z",
    "last_activity": "2024-01-28T11:00:00Z",
    "active_days": 4
  }
]
```

---

## Analytics Endpoints

### Generate Contribution Report

Generate comprehensive contribution report for a project. **Faculty only**.

**Endpoint:** `GET /analytics/contribution-report/:projectId`

**Response:** `200 OK`
```json
{
  "project": {
    "id": "project-uuid",
    "title": "Software Engineering Project",
    "start_date": "2024-01-15",
    "end_date": "2024-05-15"
  },
  "groups": [
    {
      "group_id": "group-uuid",
      "group_name": "Team Alpha",
      "members": [
        {
          "student_id": "student-uuid-1",
          "student_name": "Alice Johnson",
          "email": "alice@university.edu",
          "activity_metrics": {
            "total_activities": 45,
            "total_effort": 67.5,
            "avg_effort": 1.5,
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
        }
      ],
      "statistics": {
        "avg_effort": 46.25,
        "max_effort": 67.5,
        "min_effort": 25.0,
        "effort_variance": 42.5,
        "imbalance_ratio": 2.7
      },
      "issues": [
        {
          "student": "Bob Smith",
          "type": "low_contribution",
          "severity": "high",
          "message": "Bob Smith has significantly lower contribution (25.0 vs avg 46.3)"
        }
      ]
    }
  ],
  "generated_at": "2024-02-15T10:00:00Z"
}
```

---

### Get Active Alerts

Get all unresolved alerts for a project.

**Endpoint:** `GET /analytics/alerts/:projectId`

**Response:** `200 OK`
```json
[
  {
    "id": "alert-uuid",
    "project_id": "project-uuid",
    "group_id": "group-uuid",
    "student_id": "student-uuid",
    "student_name": "Bob Smith",
    "alert_type": "dormant",
    "severity": "high",
    "message": "Bob Smith has been inactive for 13 days",
    "is_resolved": 0,
    "created_at": "2024-02-10T10:00:00Z",
    "resolved_at": null
  }
]
```

---

### Resolve Alert

Mark an alert as resolved.

**Endpoint:** `PATCH /analytics/alerts/:alertId/resolve`

**Response:** `200 OK`
```json
{
  "message": "Alert resolved successfully"
}
```

---

## Peer Feedback Endpoints

### Submit Peer Feedback

Submit peer feedback for a team member. **Students only**.

**Endpoint:** `POST /feedback`

**Request Body:**
```json
{
  "project_id": "project-uuid",
  "group_id": "group-uuid",
  "reviewee_id": "student-uuid",
  "contribution_score": 4,
  "quality_score": 5,
  "collaboration_score": 4,
  "comments": "Great team player, always helpful"
}
```

**Parameters:**
- All scores are on a 1-5 scale
- Cannot review yourself
- Replaces existing feedback if already submitted

**Response:** `201 Created`
```json
{
  "message": "Feedback submitted successfully"
}
```

---

### Get Project Feedback

Get all peer feedback for a project. **Faculty only**.

**Endpoint:** `GET /feedback/project/:projectId`

**Response:** `200 OK`
```json
[
  {
    "id": "feedback-uuid",
    "project_id": "project-uuid",
    "group_id": "group-uuid",
    "reviewer_id": "student-uuid-1",
    "reviewer_name": "Alice Johnson",
    "reviewee_id": "student-uuid-2",
    "reviewee_name": "Bob Smith",
    "contribution_score": 4,
    "quality_score": 5,
    "collaboration_score": 4,
    "comments": "Great team player",
    "submitted_at": "2024-05-10T10:00:00Z"
  }
]
```

---

### Get Student Feedback Summary

Get aggregated feedback for a specific student.

**Endpoint:** `GET /feedback/student/:studentId/project/:projectId`

**Response:** `200 OK`
```json
{
  "avg_contribution": 4.2,
  "avg_quality": 4.5,
  "avg_collaboration": 4.3,
  "feedback_count": 3,
  "all_comments": "Great team player | Very helpful | Good communicator"
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Descriptive error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Access denied. No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Only faculty can create projects"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Server error message"
}
```

---

## Rate Limiting

Currently, there are no rate limits. This may change in future versions.

## Versioning

API Version: 1.0.0

Future versions will be accessible via `/api/v2/` etc.

---

For more information, visit the [GitHub repository](https://github.com/Aayush-sh23/fairshare-academic-system).