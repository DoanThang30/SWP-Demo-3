import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Users,
  Droplet,
  Calendar,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  User as UserIcon,
  Activity,
  TrendingUp,
  Download,
  Bell,
  Settings,
  Shield,
  FileText,
  BarChart,
  UserPlus,
  UserCog,
  LogOut
} from "lucide-react";
import { adminApi, dashboardApi, type User, type SystemLog } from "@/services/admin.service";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

interface DashboardStats {
  totalUsers: number;
  totalDonors: number;
  totalStaff: number;
  totalBloodRequests: number;
  pendingBloodRequests: number;
  totalDonations: number;
  recentDonations: number;
  bloodInventory: {
    bloodType: string;
    units: number;
  }[];
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, usersResponse, logsResponse] = await Promise.all([
          dashboardApi.getStats(),
          adminApi.getAllUsers(),
          adminApi.getSystemLogs()
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (usersResponse.success) {
          setUsers(usersResponse.data.items);
        }

        if (logsResponse.success) {
          setLogs(logsResponse.data.items);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleLogout = async () => {
    // Implement logout logic
    navigate("/login");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-800";
      case "staff": return "bg-blue-100 text-blue-800";
      case "donor": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500 p-2 rounded-full">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
                <p className="text-sm text-gray-600">System Administration & Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
              <div className="flex items-center space-x-2">
                <div className="bg-purple-500 p-2 rounded-full">
                  <UserCog className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">Admin</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">{users.length}</div>
              <p className="text-xs text-muted-foreground">Active accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">98%</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <UserIcon className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">24</div>
              <p className="text-xs text-muted-foreground">Current users online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Load</CardTitle>
              <BarChart className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">42%</div>
              <p className="text-xs text-muted-foreground">Optimal performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  User Management
                  <Button className="bg-purple-500 hover:bg-purple-600">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage system users and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-6">
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Administrators</SelectItem>
                      <SelectItem value="staff">Staff Members</SelectItem>
                      <SelectItem value="donor">Donors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.bloodType}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Logs Tab */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>
                  Monitor system activities and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.type}</TableCell>
                        <TableCell>{log.message}</TableCell>
                        <TableCell>{log.userId}</TableCell>
                        <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>
                    Manage system-wide settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">System Maintenance Mode</label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">Enable</Button>
                      <Button variant="outline" size="sm">Disable</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Backup Settings</label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Backup Now
                      </Button>
                      <Button variant="outline" size="sm">Schedule Backup</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Configure security and access control
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password Policy</label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">Edit Policy</Button>
                      <Button variant="outline" size="sm">Reset All Passwords</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Access Control</label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">Manage Roles</Button>
                      <Button variant="outline" size="sm">View Permissions</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Reports</CardTitle>
                  <CardDescription>
                    Generate and view system reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate System Report
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Last Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audit Logs</CardTitle>
                  <CardDescription>
                    View and export audit logs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button className="w-full">
                      <BarChart className="h-4 w-4 mr-2" />
                      View Audit Dashboard
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Audit Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin; 