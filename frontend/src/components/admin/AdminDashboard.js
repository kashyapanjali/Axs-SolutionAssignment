import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="container">
        <h1 className="dashboard-title">Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon today-orders">📦</div>
            <div className="stat-content">
              <h3>Today's Orders</h3>
              <p className="stat-value">{stats?.todayOrders || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon today-revenue">💰</div>
            <div className="stat-content">
              <h3>Today's Revenue</h3>
              <p className="stat-value">₹{stats?.todayRevenue?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon low-stock">⚠️</div>
            <div className="stat-content">
              <h3>Low Stock Products</h3>
              <p className="stat-value">{stats?.lowStockProducts || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon total-revenue">💵</div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-value">₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon total-orders">📊</div>
            <div className="stat-content">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats?.totalOrders || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending-orders">⏳</div>
            <div className="stat-content">
              <h3>Pending Orders</h3>
              <p className="stat-value">{stats?.pendingOrders || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

