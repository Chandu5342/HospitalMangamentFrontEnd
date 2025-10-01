import React, { useContext, useState } from 'react';
import DashboardStats from './DashboardStats.jsx';
import AddUser from './AddUser.jsx';
import UserList from './UserList.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';

const AdminDashboard = () => {
  const { role, token } = useContext(AuthContext);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => setRefreshFlag(prev => !prev);

  return (
    <div>
      <DashboardStats />
      {role === 'admin' && <AddUser onUserAdded={triggerRefresh} />}
      {['admin','reception'].includes(role) && <UserList token={token} refreshFlag={refreshFlag} />}
    </div>
  );
};

export default AdminDashboard;
