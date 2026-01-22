'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Calendar,
  TrendingUp,
  Award,
  UserCheck,
  UserX,
  Download,
  Upload
} from 'lucide-react'
import { 
  getCurrentUser, 
  getAllUsers, 
  getUsersByRole, 
  createUser, 
  updateUser, 
  deactivateUser,
  initializeStorage,
  getBadges
} from '@/lib/storage'
import type { User } from '@/lib/storage'

export default function UsersManagement() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'hr' | 'employee' | 'candidate'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [badges, setBadges] = useState<any[]>([])
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate' as 'hr' | 'employee' | 'candidate',
    department: ''
  })

  useEffect(() => {
    initializeStorage()
    const user = getCurrentUser()
    if (!user || user.role !== 'hr') {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    loadUsers()
    loadBadges()
  }, [router])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter, statusFilter])

  const loadUsers = () => {
    const allUsers = getAllUsers()
    setUsers(allUsers)
  }

  const loadBadges = () => {
    const allBadges = getBadges()
    setBadges(allBadges)
  }

  const filterUsers = () => {
    let filtered = users

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.isActive : !user.isActive
      )
    }

    setFilteredUsers(filtered)
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newUser = createUser({
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role,
        department: userForm.department,
        joined: new Date().toISOString().split('T')[0]
      })

      // Reset form
      setUserForm({
        name: '',
        email: '',
        password: '',
        role: 'candidate',
        department: ''
      })
      setShowAddUserForm(false)
      loadUsers()
      
      alert(`User ${newUser.name} created successfully!`)
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Failed to create user')
    }
  }

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const updatedUser = updateUser(userId, updates)
      if (updatedUser) {
        loadUsers()
        setEditingUser(null)
        alert('User updated successfully!')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Failed to update user')
    }
  }

  const handleDeactivateUser = async (userId: string) => {
    if (confirm('Are you sure you want to deactivate this user?')) {
      try {
        const success = deactivateUser(userId)
        if (success) {
          loadUsers()
          alert('User deactivated successfully!')
        }
      } catch (error) {
        console.error('Error deactivating user:', error)
        alert('Failed to deactivate user')
      }
    }
  }

  const getBadgeInfo = (badgeId: string) => {
    return badges.find(badge => badge.id === badgeId)
  }

  const getRoleStats = () => {
    const total = users.length
    const hr = users.filter(u => u.role === 'hr').length
    const employees = users.filter(u => u.role === 'employee').length
    const candidates = users.filter(u => u.role === 'candidate').length
    const active = users.filter(u => u.isActive).length
    
    return { total, hr, employees, candidates, active }
  }

  const stats = getRoleStats()

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
              <p className="text-muted-foreground mt-2">Manage employees, candidates, and HR personnel</p>
            </div>
            <Button 
              onClick={() => setShowAddUserForm(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-primary/50" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">HR Staff</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.hr}</p>
                </div>
                <UserCheck className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Employees</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.employees}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Candidates</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.candidates}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.active}</p>
                </div>
                <UserCheck className="h-8 w-8 text-emerald-500" />
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-6 bg-card border border-border mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="all">All Roles</option>
                <option value="hr">HR</option>
                <option value="employee">Employee</option>
                <option value="candidate">Candidate</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </Card>

          {/* Users Table */}
          <Card className="bg-card border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Badges
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-foreground">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="text-xs text-muted-foreground">
                            Joined: {user.joined || new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'hr' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'employee' ? 'bg-green-100 text-green-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {user.department || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 bg-muted rounded-full h-2 mr-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${user.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground">{user.progress || 0}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {user.points || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {user.badges?.slice(0, 3).map((badgeId) => {
                            const badge = getBadgeInfo(badgeId)
                            return badge ? (
                              <span key={badgeId} className="text-lg" title={badge.name}>
                                {badge.icon}
                              </span>
                            ) : null
                          })}
                          {(user.badges?.length || 0) > 3 && (
                            <span className="text-xs text-muted-foreground">+{(user.badges?.length || 0) - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingUser(user)}
                            className="gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeactivateUser(user.id)}
                            className="gap-1 text-red-600 hover:text-red-700"
                          >
                            <UserX className="h-3 w-3" />
                            Deactivate
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No users found</p>
                </div>
              )}
            </div>
          </Card>

          {/* Add User Modal */}
          {showAddUserForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md p-6 bg-card border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">Add New User</h2>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      required
                    >
                      <option value="candidate">Candidate</option>
                      <option value="employee">Employee</option>
                      <option value="hr">HR</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={userForm.department}
                      onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      Create User
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddUserForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* Edit User Modal */}
          {editingUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md p-6 bg-card border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">Edit User</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-department">Department</Label>
                    <Input
                      id="edit-department"
                      value={editingUser.department || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={() => handleUpdateUser(editingUser.id, {
                        name: editingUser.name,
                        department: editingUser.department
                      })}
                      className="flex-1"
                    >
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingUser(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="font-medium text-sm">
                      Password (optional)
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Leave blank for default"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role" className="font-medium text-sm">
                      Role
                    </Label>
                    <select
                      id="role"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as any)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" disabled={submitting} className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  {submitting ? 'Adding...' : 'Add User'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>All Users ({users.length})</CardTitle>
              <CardDescription>Manage user accounts and course assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((userItem) => (
                  <div key={userItem.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{userItem.name}</h3>
                        <p className="text-sm text-gray-600">{userItem.email}</p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded capitalize">
                          {userItem.role}
                        </span>
                      </div>
                      {userItem.id !== user.id && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteId(userItem.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Delete Confirmation */}
                    {deleteId === userItem.id && (
                      <div className="bg-red-50 p-3 rounded border border-red-200 mb-4">
                        <p className="text-sm text-red-900 mb-2">Confirm delete this user?</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(userItem.id)}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Course Assignments for Employees */}
                    {userItem.role === 'employee' && courses.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Assign Courses:</p>
                        <div className="space-y-2">
                          {courses.map((course) => (
                            <label
                              key={course.id}
                              className="flex items-center gap-2 cursor-pointer text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={(courseAssignments.get(course.id) || []).includes(userItem.id)}
                                onChange={() => handleAssignCourse(userItem.id, course.id)}
                                className="w-4 h-4 rounded border-gray-300"
                              />
                              <span className="text-gray-700">{course.title}</span>
                              <span className="text-xs text-gray-500">({course.points} pts)</span>
                            </label>
                          ))}
                          {courses.length === 0 && (
                            <p className="text-xs text-gray-500 italic">No courses available</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
