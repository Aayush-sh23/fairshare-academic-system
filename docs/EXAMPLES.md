# Usage Examples & Tutorials

Complete examples for using FairShare in real-world scenarios.

## Table of Contents

- [Faculty Tutorial](#faculty-tutorial)
- [Student Tutorial](#student-tutorial)
- [API Usage Examples](#api-usage-examples)
- [Common Workflows](#common-workflows)

---

## Faculty Tutorial

### Scenario: Creating a Semester-Long Group Project

**Project:** Software Engineering - Build a Task Management App

**Timeline:** January 15 - May 15, 2024

**Groups:** 3 teams of 4 students each

### Step 1: Register as Faculty

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prof.smith@university.edu",
    "password": "SecurePass123!",
    "name": "Dr. Jane Smith",
    "role": "faculty"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "faculty-uuid-123",
    "email": "prof.smith@university.edu",
    "name": "Dr. Jane Smith",
    "role": "faculty"
  }
}
```

Save the token for subsequent requests!

### Step 2: Get List of Students

```bash
curl -X GET http://localhost:3000/api/projects/students/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 3: Create Project with Milestones

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task Management Application",
    "description": "Build a full-stack task management web application with user authentication, task CRUD operations, and team collaboration features",
    "start_date": "2024-01-15",
    "end_date": "2024-05-15",
    "milestones": [
      {
        "title": "Phase 1: Requirements & Design",
        "description": "Gather requirements, create wireframes, design database schema",
        "due_date": "2024-02-15",
        "weight": 1.0
      },
      {
        "title": "Phase 2: Backend Development",
        "description": "Implement API endpoints, authentication, database integration",
        "due_date": "2024-03-15",
        "weight": 1.5
      },
      {
        "title": "Phase 3: Frontend Development",
        "description": "Build user interface, integrate with backend",
        "due_date": "2024-04-15",
        "weight": 1.5
      },
      {
        "title": "Phase 4: Testing & Deployment",
        "description": "Write tests, fix bugs, deploy to production",
        "due_date": "2024-05-10",
        "weight": 1.0
      }
    ],
    "groups": [
      {
        "name": "Team Alpha",
        "members": ["student-uuid-1", "student-uuid-2", "student-uuid-3", "student-uuid-4"]
      },
      {
        "name": "Team Beta",
        "members": ["student-uuid-5", "student-uuid-6", "student-uuid-7", "student-uuid-8"]
      },
      {
        "name": "Team Gamma",
        "members": ["student-uuid-9", "student-uuid-10", "student-uuid-11", "student-uuid-12"]
      }
    ]
  }'
```

### Step 4: Monitor Progress (Week 3)

```bash
# Get activity summary
curl -X GET http://localhost:3000/api/activity/summary/project/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response shows:**
```json
[
  {
    "user_name": "Alice Johnson",
    "activity_count": 25,
    "total_effort": 35.5,
    "active_days": 8
  },
  {
    "user_name": "Bob Smith",
    "activity_count": 8,
    "total_effort": 12.0,
    "active_days": 3
  }
]
```

**Observation:** Bob has low activity - check alerts!

### Step 5: Check Alerts

```bash
curl -X GET http://localhost:3000/api/analytics/alerts/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
[
  {
    "student_name": "Bob Smith",
    "alert_type": "low_contribution",
    "severity": "medium",
    "message": "Bob Smith has significantly lower contribution (12.0 vs avg 23.8)",
    "created_at": "2024-02-05T10:00:00Z"
  }
]
```

**Action:** Reach out to Bob early to address issues!

### Step 6: Generate Final Report (End of Semester)

```bash
curl -X GET http://localhost:3000/api/analytics/contribution-report/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Use this data for:**
- Individual grading adjustments
- Evidence for grade disputes
- Identifying exceptional contributors
- Documenting free-rider issues

---

## Student Tutorial

### Scenario: Working on Group Project

**Student:** Alice Johnson (Team Alpha)

**Project:** Task Management Application

### Step 1: Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice.johnson@university.edu",
    "password": "MySecurePass456!",
    "name": "Alice Johnson",
    "role": "student"
  }'
```

### Step 2: View Assigned Projects

```bash
curl -X GET http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 3: Get Project Details

```bash
curl -X GET http://localhost:3000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response shows:**
- Project timeline
- Milestones
- Your team members
- Group ID (needed for creating tasks)

### Step 4: Create Tasks (Week 1)

```bash
# Task 1: Design database schema
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "group_id": "GROUP_UUID",
    "milestone_id": "MILESTONE_1_UUID",
    "title": "Design database schema",
    "description": "Create ERD and define all tables, relationships, and constraints",
    "assigned_to": "alice-uuid",
    "priority": "high",
    "due_date": "2024-01-25"
  }'

# Task 2: Create wireframes
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "group_id": "GROUP_UUID",
    "milestone_id": "MILESTONE_1_UUID",
    "title": "Create wireframes for main pages",
    "description": "Design wireframes for login, dashboard, and task list pages",
    "assigned_to": "bob-uuid",
    "priority": "high",
    "due_date": "2024-01-25"
  }'
```

**Activity Logged:** Each task creation = 2.0 effort points

### Step 5: Update Task Status (Week 2)

```bash
# Start working on task
curl -X PATCH http://localhost:3000/api/tasks/TASK_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'

# Complete task
curl -X PATCH http://localhost:3000/api/tasks/TASK_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

**Activity Logged:** Task completion = 5.0 effort points

### Step 6: Add Comments

```bash
curl -X POST http://localhost:3000/api/tasks/TASK_ID/comments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I'\''ve completed the database schema. Added users, tasks, and projects tables with proper foreign keys. Please review!"
  }'
```

**Activity Logged:** Comment = 1.0 effort point

### Step 7: Submit Peer Feedback (End of Project)

```bash
curl -X POST http://localhost:3000/api/feedback \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "PROJECT_UUID",
    "group_id": "GROUP_UUID",
    "reviewee_id": "bob-uuid",
    "contribution_score": 3,
    "quality_score": 4,
    "collaboration_score": 3,
    "comments": "Bob contributed to the project but was often late with deliverables. Quality of work was good when completed."
  }'
```

### Step 8: View Your Contribution

```bash
curl -X GET http://localhost:3000/api/activity/user/YOUR_USER_ID/project/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## API Usage Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
let authToken = '';

// Register and login
async function authenticate() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'student@university.edu',
      password: 'password123'
    });
    
    authToken = response.data.token;
    console.log('Logged in successfully!');
    return authToken;
  } catch (error) {
    console.error('Authentication failed:', error.response.data);
  }
}

// Create task
async function createTask(groupId, title, description) {
  try {
    const response = await axios.post(
      `${API_URL}/tasks`,
      {
        group_id: groupId,
        title: title,
        description: description,
        priority: 'high'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    console.log('Task created:', response.data);
    return response.data.id;
  } catch (error) {
    console.error('Failed to create task:', error.response.data);
  }
}

// Get contribution report
async function getContributionReport(projectId) {
  try {
    const response = await axios.get(
      `${API_URL}/analytics/contribution-report/${projectId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    console.log('Contribution Report:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Failed to get report:', error.response.data);
  }
}

// Usage
(async () => {
  await authenticate();
  await createTask('group-uuid', 'Implement login', 'Create user authentication');
  await getContributionReport('project-uuid');
})();
```

### Python

```python
import requests
import json

API_URL = 'http://localhost:3000/api'
auth_token = ''

def authenticate(email, password):
    global auth_token
    response = requests.post(f'{API_URL}/auth/login', json={
        'email': email,
        'password': password
    })
    
    if response.status_code == 200:
        auth_token = response.json()['token']
        print('Logged in successfully!')
        return auth_token
    else:
        print('Authentication failed:', response.json())
        return None

def create_task(group_id, title, description):
    headers = {'Authorization': f'Bearer {auth_token}'}
    response = requests.post(f'{API_URL}/tasks', 
        json={
            'group_id': group_id,
            'title': title,
            'description': description,
            'priority': 'high'
        },
        headers=headers
    )
    
    if response.status_code == 201:
        print('Task created:', response.json())
        return response.json()['id']
    else:
        print('Failed to create task:', response.json())
        return None

def get_contribution_report(project_id):
    headers = {'Authorization': f'Bearer {auth_token}'}
    response = requests.get(
        f'{API_URL}/analytics/contribution-report/{project_id}',
        headers=headers
    )
    
    if response.status_code == 200:
        print('Contribution Report:', json.dumps(response.json(), indent=2))
        return response.json()
    else:
        print('Failed to get report:', response.json())
        return None

# Usage
if __name__ == '__main__':
    authenticate('student@university.edu', 'password123')
    create_task('group-uuid', 'Implement login', 'Create user authentication')
    get_contribution_report('project-uuid')
```

---

## Common Workflows

### Workflow 1: Weekly Progress Check (Faculty)

```bash
#!/bin/bash

PROJECT_ID="your-project-id"
TOKEN="your-jwt-token"

echo "=== Weekly Progress Report ==="
echo ""

# Get activity summary
echo "Activity Summary:"
curl -s -X GET "http://localhost:3000/api/activity/summary/project/$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "Active Alerts:"
curl -s -X GET "http://localhost:3000/api/analytics/alerts/$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Workflow 2: Daily Standup Update (Student)

```bash
#!/bin/bash

GROUP_ID="your-group-id"
TOKEN="your-jwt-token"

# Get today's tasks
echo "=== Today's Tasks ==="
curl -s -X GET "http://localhost:3000/api/tasks/group/$GROUP_ID" \
  -H "Authorization: Bearer $TOKEN" | \
  jq '.[] | select(.assigned_to == "your-user-id") | {title, status, due_date}'
```

### Workflow 3: End-of-Sprint Report

```bash
#!/bin/bash

PROJECT_ID="your-project-id"
START_DATE="2024-02-01"
END_DATE="2024-02-15"
TOKEN="your-jwt-token"

echo "=== Sprint Report ($START_DATE to $END_DATE) ==="

# Get activities in date range
curl -s -X GET "http://localhost:3000/api/activity/project/$PROJECT_ID?startDate=$START_DATE&endDate=$END_DATE" \
  -H "Authorization: Bearer $TOKEN" | \
  jq 'group_by(.user_name) | map({user: .[0].user_name, activities: length, total_effort: map(.effort_score) | add})'
```

---

## Tips & Best Practices

### For Faculty

1. **Set Clear Expectations**
   - Define what counts as meaningful contribution
   - Explain the effort scoring system
   - Show students how to use the system

2. **Monitor Early and Often**
   - Check alerts weekly
   - Intervene when you see issues
   - Don't wait until the end

3. **Use Data Wisely**
   - Combine with other assessment methods
   - Consider context (illness, emergencies)
   - Use as evidence, not sole determinant

### For Students

1. **Log Everything**
   - Create tasks for all work
   - Update status regularly
   - Add meaningful comments

2. **Communicate**
   - Use comments for team coordination
   - Document decisions
   - Share progress updates

3. **Be Honest in Peer Feedback**
   - System cross-checks with activity logs
   - Dishonest feedback will be flagged
   - Focus on constructive feedback

---

## Troubleshooting

### "Task not showing in my list"
- Check if you're looking at the correct group
- Verify task was created successfully
- Refresh your query

### "Contribution score seems low"
- Review your activity log
- Ensure you're updating task status
- Add comments to show engagement

### "Can't submit peer feedback"
- Check if you're trying to review yourself
- Verify project and group IDs
- Ensure you're a student (not faculty)

---

For more examples, check the [API Documentation](API.md).