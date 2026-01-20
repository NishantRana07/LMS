// LocalStorage utilities for QEdge LMS

export interface User {
  id: string
  email: string
  password: string
  role: 'admin' | 'employee' | 'technical_team' | 'developer' | 'content_team'
  name: string
  createdAt: string
  department?: string
}

export interface Course {
  id: string
  title: string
  description: string
  createdBy: string
  createdAt: string
  assignedTo: string[]
  lessons: Lesson[]
  points: number
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  content: string
  type: 'video' | 'document' | 'text'
  fileUrl?: string
  fileName?: string
  completed: boolean
}

export interface Meeting {
  id: string
  title: string
  description: string
  scheduledAt: string
  participants: string[]
  createdBy: string
  meetingLink: string
}

export interface Attendance {
  id: string
  meetingId: string
  userId: string
  joinedAt: string
  leftAt?: string
  duration: number
  status: 'present' | 'absent'
}

export interface Notification {
  id: string
  userId: string
  type: 'course_assigned' | 'meeting_scheduled' | 'course_completed' | 'reminder'
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface Points {
  id: string
  userId: string
  courseId: string
  points: number
  earnedAt: string
}

export interface CourseStat {
  userId: string
  courseId: string
  started: boolean
  lessonsCompleted: number
  totalLessons: number
  pointsEarned: number
}

export interface Email {
  id: string
  trackingId: string
  senderId: string
  recipientEmail: string
  recipientId?: string
  subject: string
  htmlContent: string
  sentAt: string
  opened: boolean
  openedAt?: string
  links: EmailLink[]
}

export interface EmailLink {
  id: string
  emailId: string
  originalUrl: string
  trackingUrl: string
  clicked: boolean
  clickedAt?: string
  clickCount: number
}

export interface EmailTracking {
  id: string
  emailId: string
  trackingId: string
  type: 'open' | 'click'
  timestamp: string
  userAgent?: string
  ipAddress?: string
}

// Initialize LocalStorage with demo data
export function initializeStorage() {
  // Demo users
  const demoUsers: User[] = [
    {
      id: 'user-admin-1',
      email: 'hr@company.com',
      password: 'admin123',
      role: 'admin',
      name: 'Sarah Johnson',
      createdAt: new Date().toISOString(),
      department: 'HR'
    },
    {
      id: 'user-emp-1',
      email: 'user@company.com',
      password: 'user123',
      role: 'employee',
      name: 'John Smith',
      createdAt: new Date().toISOString(),
      department: 'Sales'
    },
    {
      id: 'user-tech-1',
      email: 'tech@company.com',
      password: 'tech123',
      role: 'technical_team',
      name: 'Mike Chen',
      createdAt: new Date().toISOString(),
      department: 'IT'
    },
    {
      id: 'user-dev-1',
      email: 'dev@company.com',
      password: 'dev123',
      role: 'developer',
      name: 'Alice Wilson',
      createdAt: new Date().toISOString(),
      department: 'Engineering'
    },
    {
      id: 'user-content-1',
      email: 'content@company.com',
      password: 'content123',
      role: 'content_team',
      name: 'Bob Davis',
      createdAt: new Date().toISOString(),
      department: 'Marketing'
    }
  ]

  if (!localStorage.getItem('qedge_users')) {
    localStorage.setItem('qedge_users', JSON.stringify(demoUsers))
  }

  // Demo Courses
  if (!localStorage.getItem('qedge_courses')) {
    const demoCourses: Course[] = [
      {
        id: 'course-demo-1',
        title: 'Onboarding Essentials',
        description: 'Learn company policies, procedures, and get up to speed quickly with our onboarding program.',
        createdBy: 'user-admin-1',
        createdAt: new Date().toISOString(),
        assignedTo: ['user-emp-1'],
        lessons: [
          {
            id: 'lesson-1',
            courseId: 'course-demo-1',
            title: 'Welcome to Our Company',
            content: 'Welcome content',
            type: 'text',
            completed: false,
          },
          {
            id: 'lesson-2',
            courseId: 'course-demo-1',
            title: 'Company Policies',
            content: 'Policies content',
            type: 'document',
            fileName: 'company-policies.pdf',
            completed: false,
          },
          {
            id: 'lesson-3',
            courseId: 'course-demo-1',
            title: 'Team Introduction',
            content: 'Team intro video',
            type: 'video',
            completed: false,
          },
        ],
        points: 100,
      },
      {
        id: 'course-demo-2',
        title: 'Professional Development',
        description: 'Enhance your professional skills and advance your career within our organization.',
        createdBy: 'user-admin-1',
        createdAt: new Date().toISOString(),
        assignedTo: ['user-emp-1'],
        lessons: [
          {
            id: 'lesson-4',
            courseId: 'course-demo-2',
            title: 'Leadership Basics',
            content: 'Leadership content',
            type: 'text',
            completed: false,
          },
          {
            id: 'lesson-5',
            courseId: 'course-demo-2',
            title: 'Communication Skills',
            content: 'Communication content',
            type: 'video',
            completed: false,
          },
        ],
        points: 75,
      },
      {
        id: 'course-demo-3',
        title: 'Compliance & Safety',
        description: 'Important compliance training and workplace safety protocols that all employees must complete.',
        createdBy: 'user-admin-1',
        createdAt: new Date().toISOString(),
        assignedTo: ['user-emp-1'],
        lessons: [
          {
            id: 'lesson-6',
            courseId: 'course-demo-3',
            title: 'Safety Regulations',
            content: 'Safety content',
            type: 'document',
            fileName: 'safety-guide.pdf',
            completed: false,
          },
          {
            id: 'lesson-7',
            courseId: 'course-demo-3',
            title: 'Incident Reporting',
            content: 'Incident content',
            type: 'text',
            completed: false,
          },
        ],
        points: 50,
      },
    ]
    localStorage.setItem('qedge_courses', JSON.stringify(demoCourses))
  }

  // Demo Meetings
  if (!localStorage.getItem('qedge_meetings')) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(14, 0, 0, 0)

    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    nextWeek.setHours(10, 0, 0, 0)

    const demoCourses: Meeting[] = [
      {
        id: 'meeting-demo-1',
        title: 'Team Orientation',
        description: 'Welcome session to meet your team and learn about departmental goals.',
        scheduledAt: tomorrow.toISOString(),
        participants: ['user-emp-1', 'user-admin-1'],
        createdBy: 'user-admin-1',
        meetingLink: 'https://qedge.local/meeting/meeting-demo-1',
      },
      {
        id: 'meeting-demo-2',
        title: 'Quarterly Strategy Review',
        description: 'Review company strategy and Q1 goals with the team.',
        scheduledAt: nextWeek.toISOString(),
        participants: ['user-emp-1', 'user-admin-1'],
        createdBy: 'user-admin-1',
        meetingLink: 'https://qedge.local/meeting/meeting-demo-2',
      },
    ]
    localStorage.setItem('qedge_meetings', JSON.stringify(demoCourses))
  }

  if (!localStorage.getItem('qedge_notifications')) {
    localStorage.setItem('qedge_notifications', JSON.stringify([]))
  }

  if (!localStorage.getItem('qedge_attendance')) {
    localStorage.setItem('qedge_attendance', JSON.stringify([]))
  }

  if (!localStorage.getItem('qedge_points')) {
    localStorage.setItem('qedge_points', JSON.stringify([]))
  }

  if (!localStorage.getItem('qedge_course_stats')) {
    localStorage.setItem('qedge_course_stats', JSON.stringify([]))
  }

  if (!localStorage.getItem('qedge_emails')) {
    localStorage.setItem('qedge_emails', JSON.stringify([]))
  }

  if (!localStorage.getItem('qedge_email_tracking')) {
    localStorage.setItem('qedge_email_tracking', JSON.stringify([]))
  }
}

// Auth functions
export function findUserByEmail(email: string): User | null {
  const users = JSON.parse(localStorage.getItem('qedge_users') || '[]') as User[]
  return users.find((u) => u.email === email) || null
}

export function validateCredentials(email: string, password: string): User | null {
  const user = findUserByEmail(email)
  if (user && user.password === password) {
    return user
  }
  return null
}

export function getCurrentUser(): User | null {
  const user = localStorage.getItem('qedge_current_user')
  return user ? JSON.parse(user) : null
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem('qedge_current_user', JSON.stringify(user))
  } else {
    localStorage.removeItem('qedge_current_user')
  }
}

// User management functions
export function getAllUsers(): User[] {
  return JSON.parse(localStorage.getItem('qedge_users') || '[]') as User[]
}

export function getUsersByRole(role: User['role']): User[] {
  const users = getAllUsers()
  return users.filter((u) => u.role === role)
}

export function getUsersByRoles(roles: User['role'][]): User[] {
  const users = getAllUsers()
  return users.filter((u) => roles.includes(u.role))
}

export function getUserEmailsByRole(role: User['role']): string[] {
  const users = getUsersByRole(role)
  return users.map((u) => u.email)
}

export function getUserEmailsByRoles(roles: User['role'][]): string[] {
  const users = getUsersByRoles(roles)
  return users.map((u) => u.email)
}

export function getAllUserEmails(): string[] {
  const users = getAllUsers()
  return users.map((u) => u.email)
}

// Course functions
export function getCourses(): Course[] {
  return JSON.parse(localStorage.getItem('qedge_courses') || '[]')
}

export function createCourse(course: Omit<Course, 'id' | 'createdAt'>): Course {
  const courses = getCourses()
  const newCourse: Course = {
    ...course,
    id: `course-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  courses.push(newCourse)
  localStorage.setItem('qedge_courses', JSON.stringify(courses))
  return newCourse
}

export function getCourseById(id: string): Course | null {
  const courses = getCourses()
  return courses.find((c) => c.id === id) || null
}

export function updateCourse(id: string, updates: Partial<Course>): Course | null {
  const courses = getCourses()
  const index = courses.findIndex((c) => c.id === id)
  if (index === -1) return null
  
  courses[index] = { ...courses[index], ...updates }
  localStorage.setItem('qedge_courses', JSON.stringify(courses))
  return courses[index]
}

// Meeting functions
export function getMeetings(): Meeting[] {
  return JSON.parse(localStorage.getItem('qedge_meetings') || '[]')
}

export function createMeeting(meeting: Omit<Meeting, 'id' | 'meetingLink'>): Meeting {
  const meetings = getMeetings()
  const newMeeting: Meeting = {
    ...meeting,
    id: `meeting-${Date.now()}`,
    meetingLink: `https://qedge.local/meeting/${`meeting-${Date.now()}`}`,
  }
  meetings.push(newMeeting)
  localStorage.setItem('qedge_meetings', JSON.stringify(meetings))
  return newMeeting
}

export function getMeetingById(id: string): Meeting | null {
  const meetings = getMeetings()
  return meetings.find((m) => m.id === id) || null
}

// Attendance functions
export function getAttendance(): Attendance[] {
  return JSON.parse(localStorage.getItem('qedge_attendance') || '[]')
}

export function recordAttendance(attendance: Omit<Attendance, 'id'>): Attendance {
  const records = getAttendance()
  const newRecord: Attendance = {
    ...attendance,
    id: `attendance-${Date.now()}`,
  }
  records.push(newRecord)
  localStorage.setItem('qedge_attendance', JSON.stringify(records))
  return newRecord
}

export function getAttendanceByMeetingAndUser(meetingId: string, userId: string): Attendance | null {
  const records = getAttendance()
  return records.find((a) => a.meetingId === meetingId && a.userId === userId) || null
}

export function updateAttendance(id: string, updates: Partial<Attendance>): Attendance | null {
  const records = getAttendance()
  const index = records.findIndex((a) => a.id === id)
  if (index === -1) return null
  
  records[index] = { ...records[index], ...updates }
  localStorage.setItem('qedge_attendance', JSON.stringify(records))
  return records[index]
}

// Notification functions
export function getNotifications(userId: string): Notification[] {
  const all = JSON.parse(localStorage.getItem('qedge_notifications') || '[]') as Notification[]
  return all.filter((n) => n.userId === userId)
}

export function createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Notification {
  const all = JSON.parse(localStorage.getItem('qedge_notifications') || '[]') as Notification[]
  const newNotification: Notification = {
    ...notification,
    id: `notification-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  all.push(newNotification)
  localStorage.setItem('qedge_notifications', JSON.stringify(all))
  return newNotification
}

// Points functions
export function addPoints(userId: string, courseId: string, points: number): Points {
  const all = JSON.parse(localStorage.getItem('qedge_points') || '[]') as Points[]
  const newPoints: Points = {
    id: `points-${Date.now()}`,
    userId,
    courseId,
    points,
    earnedAt: new Date().toISOString(),
  }
  all.push(newPoints)
  localStorage.setItem('qedge_points', JSON.stringify(all))
  return newPoints
}

export function getUserPoints(userId: string): number {
  const all = JSON.parse(localStorage.getItem('qedge_points') || '[]') as Points[]
  return all.filter((p) => p.userId === userId).reduce((sum, p) => sum + p.points, 0)
}

// Course stats
export function getCourseStat(userId: string, courseId: string): CourseStat | null {
  const all = JSON.parse(localStorage.getItem('qedge_course_stats') || '[]') as CourseStat[]
  return all.find((s) => s.userId === userId && s.courseId === courseId) || null
}

export function updateCourseStat(userId: string, courseId: string, updates: Partial<CourseStat>): CourseStat {
  const all = JSON.parse(localStorage.getItem('qedge_course_stats') || '[]') as CourseStat[]
  let stat = all.find((s) => s.userId === userId && s.courseId === courseId)
  
  if (!stat) {
    stat = {
      userId,
      courseId,
      started: false,
      lessonsCompleted: 0,
      totalLessons: 0,
      pointsEarned: 0,
    }
    all.push(stat)
  }
  
  const index = all.findIndex((s) => s.userId === userId && s.courseId === courseId)
  all[index] = { ...stat, ...updates }
  localStorage.setItem('qedge_course_stats', JSON.stringify(all))
  return all[index]
}

// Email functions
export function getEmails(userId?: string): Email[] {
  const all = JSON.parse(localStorage.getItem('qedge_emails') || '[]') as Email[]
  if (userId) {
    return all.filter((e) => e.senderId === userId)
  }
  return all
}

export function createEmail(email: Omit<Email, 'id' | 'sentAt' | 'opened'>): Email {
  const all = JSON.parse(localStorage.getItem('qedge_emails') || '[]') as Email[]
  const newEmail: Email = {
    ...email,
    id: `email-${Date.now()}`,
    sentAt: new Date().toISOString(),
    opened: false,
  }
  all.push(newEmail)
  localStorage.setItem('qedge_emails', JSON.stringify(all))
  return newEmail
}

export function getEmailByTrackingId(trackingId: string): Email | null {
  const all = JSON.parse(localStorage.getItem('qedge_emails') || '[]') as Email[]
  return all.find((e) => e.trackingId === trackingId) || null
}

export function recordEmailOpen(emailId: string): Email | null {
  const all = JSON.parse(localStorage.getItem('qedge_emails') || '[]') as Email[]
  const email = all.find((e) => e.id === emailId)
  if (!email) return null
  
  email.opened = true
  email.openedAt = new Date().toISOString()
  localStorage.setItem('qedge_emails', JSON.stringify(all))
  return email
}

export function recordEmailClick(emailId: string, linkId: string): Email | null {
  const all = JSON.parse(localStorage.getItem('qedge_emails') || '[]') as Email[]
  const email = all.find((e) => e.id === emailId)
  if (!email) return null
  
  const link = email.links.find((l) => l.id === linkId)
  if (link) {
    link.clicked = true
    link.clickedAt = new Date().toISOString()
    link.clickCount += 1
  }
  
  localStorage.setItem('qedge_emails', JSON.stringify(all))
  return email
}

export function getEmailStats(userId: string) {
  const emails = getEmails(userId)
  const totalSent = emails.length
  const totalOpened = emails.filter((e) => e.opened).length
  const totalClicks = emails.reduce((sum, e) => sum + e.links.filter((l) => l.clicked).length, 0)
  
  return {
    totalSent,
    totalOpened,
    openRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
    totalClicks,
    clickRate: totalSent > 0 ? (totalClicks / totalSent) * 100 : 0,
  }
}
