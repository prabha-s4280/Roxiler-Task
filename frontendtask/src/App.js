import React, { useState } from 'react';
import './App.css';
import BarChart from './Components/BarChart';
import DropDown from './Components/DropDown';
import StatisticsBox from './Components/StatisticsBox';
import TransactionTable from './Components/TransactionTable';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState('March');

  return (
    <div className="app-container">
      <h1 className="dashboard-title">Transactions Dashboard</h1>
      
      {/* Dropdown to select month */}
      <div className="dropdown-section">
        <DropDown selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
      </div>

      {/* Display statistics based on selected month */}
      <div className="statistics-section">
        <StatisticsBox selectedMonth={selectedMonth} />
      </div>

      {/* Display transaction table based on selected month */}
      <div className="transaction-table-section">
        <TransactionTable selectedMonth={selectedMonth} />
      </div>

      {/* BarChart that dynamically fetches data based on selected month */}
      <div className="chart-section">
        <BarChart selectedMonth={selectedMonth} />
      </div>
    </div>
  );
};

export default App;
