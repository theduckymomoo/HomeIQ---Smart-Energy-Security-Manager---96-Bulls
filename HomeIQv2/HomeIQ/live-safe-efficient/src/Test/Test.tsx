import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RefreshCw, 
  User, 
  Trash2,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/supabaseClient';

interface Profile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  emergency_contact: string;
  emergency_phone: string;
  group_chat?: string;
  created_at?: string;
  updated_at?: string;
}

interface TestResult {
  test: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

const DatabaseTest = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  
  // Test form data
  const [testProfile, setTestProfile] = useState({
    username: 'testuser_' + Date.now(),
    first_name: 'Test',
    last_name: 'User',
    email: `test_${Date.now()}@example.com`,
    phone: '0123456789',
    address: '123 Test Street, Test City',
    emergency_contact: 'Test Emergency',
    emergency_phone: '0987654321',
    group_chat: 'test_group'
  });

  const updateTestResult = (test: string, status: 'pending' | 'success' | 'error', message: string, data?: any) => {
    setTestResults(prev => {
      const existing = prev.find(r => r.test === test);
      if (existing) {
        existing.status = status;
        existing.message = message;
        existing.data = data;
        return [...prev];
      }
      return [...prev, { test, status, message, data }];
    });
  };

  const runDatabaseTests = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Basic Connection
      console.log('Testing basic connection...');
      updateTestResult('connection', 'pending', 'Testing connection...');
      
      const { data: connectionData, error: connectionError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
        
      if (connectionError) {
        updateTestResult('connection', 'error', `Connection failed: ${connectionError.message}`);
        setConnectionStatus('error');
        return;
      } else {
        updateTestResult('connection', 'success', 'Database connection successful');
        setConnectionStatus('connected');
      }

      // Test 2: Table Structure
      console.log('Testing table structure...');
      updateTestResult('structure', 'pending', 'Checking table structure...');
      
      const { data: structureData, error: structureError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
        
      if (structureError) {
        updateTestResult('structure', 'error', `Table structure error: ${structureError.message}`);
      } else {
        updateTestResult('structure', 'success', 'Table structure is accessible', structureData);
      }

      // Test 3: Read All Profiles
      console.log('Testing read operation...');
      updateTestResult('read', 'pending', 'Reading profiles...');
      
      const { data: readData, error: readError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (readError) {
        updateTestResult('read', 'error', `Read error: ${readError.message}`);
      } else {
        updateTestResult('read', 'success', `Found ${readData.length} profiles`, readData);
        setProfiles(readData || []);
      }

      // Test 4: Create Operation
      console.log('Testing create operation...');
      updateTestResult('create', 'pending', 'Creating test profile...');
      
      const createData = {
        ...testProfile,
        id: crypto.randomUUID()
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert(createData)
        .select()
        .single();
        
      if (insertError) {
        updateTestResult('create', 'error', `Create error: ${insertError.message}`, insertError);
      } else {
        updateTestResult('create', 'success', 'Test profile created successfully', insertData);
        
        // Test 5: Update Operation
        console.log('Testing update operation...');
        updateTestResult('update', 'pending', 'Updating test profile...');
        
        const { data: updateData, error: updateError } = await supabase
          .from('profiles')
          .update({ 
            first_name: 'Updated Test',
            updated_at: new Date().toISOString()
          })
          .eq('id', insertData.id)
          .select()
          .single();
          
        if (updateError) {
          updateTestResult('update', 'error', `Update error: ${updateError.message}`);
        } else {
          updateTestResult('update', 'success', 'Profile updated successfully', updateData);
        }
        
        // Test 6: Delete Operation
        console.log('Testing delete operation...');
        updateTestResult('delete', 'pending', 'Deleting test profile...');
        
        const { error: deleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', insertData.id);
          
        if (deleteError) {
          updateTestResult('delete', 'error', `Delete error: ${deleteError.message}`);
        } else {
          updateTestResult('delete', 'success', 'Test profile deleted successfully');
        }
      }

      // Test 7: Auth Connection
      console.log('Testing auth connection...');
      updateTestResult('auth', 'pending', 'Testing authentication service...');
      
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        updateTestResult('auth', 'error', `Auth error: ${authError.message}`);
      } else {
        updateTestResult('auth', 'success', `Auth service accessible. Current session: ${authData.session ? 'Active' : 'None'}`, authData);
      }

    } catch (error: any) {
      console.error('Test suite error:', error);
      updateTestResult('general', 'error', `Test suite error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error refreshing profiles:', error);
      } else {
        setProfiles(data || []);
      }
    } catch (error) {
      console.error('Error refreshing profiles:', error);
    }
  };

  const deleteProfile = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', id);
          
        if (error) {
          alert('Error deleting profile: ' + error.message);
        } else {
          alert('Profile deleted successfully');
          await refreshProfiles();
        }
      } catch (error) {
        alert('Error deleting profile: ' + error);
      }
    }
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    refreshProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header and Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl">Database Connection Test</CardTitle>
                  <CardDescription>
                    Comprehensive testing suite for Supabase database operations
                  </CardDescription>
                </div>
              </div>
              <Badge 
                variant={connectionStatus === 'connected' ? 'default' : connectionStatus === 'error' ? 'destructive' : 'secondary'}
                className="px-3 py-1"
              >
                {connectionStatus === 'connected' && <CheckCircle className="w-3 h-3 mr-1" />}
                {connectionStatus === 'error' && <XCircle className="w-3 h-3 mr-1" />}
                {connectionStatus === 'unknown' && <AlertTriangle className="w-3 h-3 mr-1" />}
                {connectionStatus.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button 
                onClick={runDatabaseTests} 
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Run All Tests
              </Button>
              <Button 
                variant="outline" 
                onClick={refreshProfiles}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Refresh Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results and Test Form */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Results of database operation tests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {testResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Click "Run All Tests" to start testing</p>
                </div>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}>
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium capitalize">{result.test} Test</span>
                    </div>
                    <p className="text-sm">{result.message}</p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer text-gray-600">
                          View Details
                        </summary>
                        <pre className="mt-2 text-xs bg-white/50 p-2 rounded overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Test Form */}
          <Card>
            <CardHeader>
              <CardTitle>Test Profile Data</CardTitle>
              <CardDescription>
                Modify the test data used for create/update tests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={testProfile.username}
                    onChange={(e) => setTestProfile(prev => ({...prev, username: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={testProfile.email}
                    onChange={(e) => setTestProfile(prev => ({...prev, email: e.target.value}))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={testProfile.first_name}
                    onChange={(e) => setTestProfile(prev => ({...prev, first_name: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={testProfile.last_name}
                    onChange={(e) => setTestProfile(prev => ({...prev, last_name: e.target.value}))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={testProfile.phone}
                  onChange={(e) => setTestProfile(prev => ({...prev, phone: e.target.value}))}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={testProfile.address}
                  onChange={(e) => setTestProfile(prev => ({...prev, address: e.target.value}))}
                />
              </div>

              <Button
                onClick={() => setTestProfile(prev => ({
                  ...prev,
                  username: 'testuser_' + Date.now(),
                  email: `test_${Date.now()}@example.com`
                }))}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Generate New Test Data
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profiles Data Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Current Profiles in Database</CardTitle>
                <CardDescription>
                  View all profiles currently stored in the database
                </CardDescription>
              </div>
              <Badge variant="outline">
                {profiles.length} records
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {profiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No profiles found in database</p>
              </div>
            ) : (
              <div className="space-y-4">
                {profiles.map((profile) => (
                  <div key={profile.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Name</p>
                          <p className="text-sm">{profile.first_name} {profile.last_name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Username</p>
                          <p className="text-sm">{profile.username}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="text-sm">{profile.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone</p>
                          <p className="text-sm">{profile.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
                          <p className="text-sm">{profile.emergency_contact || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Created</p>
                          <p className="text-sm">{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProfile(profile.id)}
                        className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <details>
                      <summary className="text-sm cursor-pointer text-gray-600 hover:text-gray-800">
                        View Full Profile Data
                      </summary>
                      <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-x-auto">
                        {JSON.stringify(profile, null, 2)}
                      </pre>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connection Info */}
        <Card>
          <CardHeader>
            <CardTitle>Connection Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">Supabase URL</p>
                <p className="font-mono bg-gray-100 p-2 rounded">https://gklsblxfbnliketzmqoo.supabase.co</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Table</p>
                <p className="font-mono bg-gray-100 p-2 rounded">profiles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseTest;