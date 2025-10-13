import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import api from '@/api';
import { 
  Users, 
  MessageSquare, 
  UserPlus, 
  Activity,
  Loader2,
  Calendar,
  Mail,
  FileText,
  Download
} from 'lucide-react';

interface AdminStats {
  total_users: number;
  total_feedback: number;
  recent_signups: number;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  usertype: number;
  content_count?: number;
  extraction_count?: number;
  extractor_usage_count?: number;
  generator_usage_count?: number;
}

interface Feedback {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const Admin = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminData();
    fetchUsers();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
      setFeedback(response.data.feedback || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      // Use the separate users endpoint that includes usage counts
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="card-gradient border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registered users on the platform
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_feedback || 0}</div>
            <p className="text-xs text-muted-foreground">
              Feedback submissions received
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.recent_signups || 0}</div>
            <p className="text-xs text-muted-foreground">
              New users this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="card-gradient border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Users Overview</span>
          </CardTitle>
          <CardDescription>
            Manage and monitor user accounts with usage statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">User</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Extractor Usage</th>
                  <th className="text-left p-3 font-medium">Generator Usage</th>
                  <th className="text-left p-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="p-3">
                      <div className="font-medium">{user.full_name || 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">
                        ID: {user.id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.usertype === 1
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.usertype === 1 ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Download className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {user.extractor_usage_count || user.extraction_count || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {user.generator_usage_count || user.content_count || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(user.created_at)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card className="card-gradient border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>User Feedback</span>
          </CardTitle>
          <CardDescription>
            Recent feedback from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedback.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No feedback received yet</p>
              </div>
            ) : (
              feedback.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.message}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;