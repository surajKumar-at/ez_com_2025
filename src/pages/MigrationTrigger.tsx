import React from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export default function MigrationTrigger() {
  const triggerMigration = async () => {
    try {
      console.log('🚀 Triggering user migration...');
      
      const response = await axios.post('https://ifonmbbhyreuewdcvfyt.supabase.co/functions/v1/users', {
        action: 'migrate-existing-users'
      }, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlmb25tYmJoeXJldWV3ZGN2Znl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1ODYwMzksImV4cCI6MjA2ODE2MjAzOX0.BFHVOVIU7Fb89Wys1Mwtc2mzwiRmpGKZyyrF1o55DX0`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Migration response:', response.data);
      alert('Migration completed! Check console for details.');
    } catch (error) {
      console.error('❌ Migration error:', error);
      alert('Migration failed! Check console for details.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">EZC Users Migration</h1>
      <p className="mb-4">This will migrate all users from ezc_users to auth.users with password "portal"</p>
      <Button onClick={triggerMigration}>
        Start Migration
      </Button>
    </div>
  );
}