import React from 'react';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/config/api';

export default function MigrationTrigger() {
  const triggerMigration = async () => {
    try {
      console.log('🚀 Triggering user migration...');
      
      const response = await axiosInstance.post('/users', {
        action: 'migrate-existing-users'
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