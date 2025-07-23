import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, CheckCircle, XCircle } from 'lucide-react';
import { userService } from '@/services/userService';

export default function MigrateUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationResult, setMigrationResult] = useState<any>(null);

  const handleMigration = async () => {
    setIsLoading(true);
    setMigrationResult(null);
    
    try {
      console.log('🚀 Starting user migration process...');
      const result = await userService.migrateExistingUsers();
      console.log('✅ Migration completed:', result);
      setMigrationResult(result);
    } catch (error) {
      console.error('❌ Migration failed:', error);
      setMigrationResult({
        success: false,
        error: error.message || 'Migration failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Migrate Users to Auth System</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>EZC Users → Supabase Auth Migration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-muted-foreground">
              <p className="mb-2">This will:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Create auth.users records for all ezc_users</li>
                <li>Set default password "portal" for all users</li>
                <li>Link ezc_users with auth.users via supabase_user_id</li>
                <li>Enable users to login to the portal</li>
              </ul>
            </div>

            <Button 
              onClick={handleMigration} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating Users...
                </>
              ) : (
                'Start Migration'
              )}
            </Button>

            {migrationResult && (
              <Alert className={migrationResult.success ? 'border-green-500' : 'border-red-500'}>
                <div className="flex items-start gap-2">
                  {migrationResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <AlertDescription>
                      <div className="font-semibold mb-2">
                        {migrationResult.success ? 'Migration Successful!' : 'Migration Failed'}
                      </div>
                      <div>{migrationResult.message}</div>
                      
                      {migrationResult.summary && (
                        <div className="mt-3 space-y-1">
                          <div>Total Users: {migrationResult.summary.total}</div>
                          <div>✅ Successful: {migrationResult.summary.successful}</div>
                          <div>❌ Failed: {migrationResult.summary.failed}</div>
                          <div className="font-semibold text-green-600">
                            Password for all users: "{migrationResult.summary.password}"
                          </div>
                        </div>
                      )}

                      {migrationResult.successful_users && migrationResult.successful_users.length > 0 && (
                        <details className="mt-3">
                          <summary className="cursor-pointer font-semibold">
                            View Successful Migrations ({migrationResult.successful_users.length})
                          </summary>
                          <div className="mt-2 space-y-1 text-sm">
                            {migrationResult.successful_users.map((user: any) => (
                              <div key={user.eu_id} className="flex justify-between">
                                <span>{user.email}</span>
                                <span className="text-muted-foreground">{user.eu_id}</span>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}

                      {migrationResult.failed_users && migrationResult.failed_users.length > 0 && (
                        <details className="mt-3">
                          <summary className="cursor-pointer font-semibold text-red-600">
                            View Failed Migrations ({migrationResult.failed_users.length})
                          </summary>
                          <div className="mt-2 space-y-1 text-sm">
                            {migrationResult.failed_users.map((user: any) => (
                              <div key={user.eu_id} className="border-l-2 border-red-200 pl-2">
                                <div>{user.email} ({user.eu_id})</div>
                                <div className="text-red-600">{user.error}</div>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}