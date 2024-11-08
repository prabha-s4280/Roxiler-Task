import React, { useEffect, useState } from 'react';
import { fetchStatistics } from './api';
import './StatisticsBox.css';

const StatisticsBox = ({ selectedMonth }) => {
  const [stats, setStats] = useState({
    totalSaleAmount: 0,
    totalItemsSold: 0,
    totalItemsNotSold: 0,
  });

  // Fetch statistics data based on the selected month
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const { data } = await fetchStatistics(selectedMonth);
        setStats(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    if (selectedMonth) {
      loadStatistics();
    }
  }, [selectedMonth]);

  return (
    <div className="statistics-box">
      <div className="stat-item">
        <h3>Total Sale Amount</h3>
        <p>₹ {stats.totalSaleAmount?.toLocaleString() || 0}</p>
      </div>
      <div className="stat-item">
        <h3>Total Items Sold</h3>
        <p>{stats.totalItemsSold || 0}</p>
      </div>
      <div className="stat-item">
        <h3>Total Items Not Sold</h3>
        <p>{stats.totalItemsNotSold || 0}</p>
      </div>
    </div>
  );
};

export default StatisticsBox;
