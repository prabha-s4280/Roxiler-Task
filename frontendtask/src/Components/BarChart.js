import axios from 'axios';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import './BarChart.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Predefined price ranges
  const priceRanges = [
    '0-100',
    '101-200',
    '201-300',
    '301-400',
    '401-500',
    '501-600',
    '601-700',
    '701-800',
    '801-900',
    '901-above',
  ];

  // Fetch data from the backend and map it to the price ranges
  const fetchBarChartData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/bar-chart', {
        params: { month: selectedMonth.toLowerCase() },
      });

      console.log('Raw response:', response.data);

      const data = response.data;

      if (!Array.isArray(data)) {
        console.error('Unexpected data format:', data);
        return;
      }

      const normalizeRange = (range) => range.replace(/\s+/g, '').toLowerCase();

     
      const rangeMap = priceRanges.map((range) => {
        const normalizedRange = normalizeRange(range);
        const item = data.find(
          (entry) => normalizeRange(entry.priceRange) === normalizedRange
        );
        return item ? item.itemCount : 0; 
      });

      console.log('Mapped data for chart:', rangeMap);

   
      setChartData({
        labels: priceRanges,
        datasets: [
          {
            label: `Sales Distribution for ${selectedMonth}`,
            data: rangeMap,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (selectedMonth) {
      fetchBarChartData();
    }
  }, [selectedMonth]);

  return (
    <div className="bar-chart-container">
      {loading ? (
        <p>Loading chart...</p>
      ) : chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { size: 14 },
                bodyFont: { size: 12 },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Price Ranges',
                  font: { size: 16 },
                  color: '#007bff',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Item Count',
                  font: { size: 16 },
                  color: '#007bff',
                },
                beginAtZero: true,
              },
            },
          }}
        />
      ) : (
        <p>No data available for the selected month.</p>
      )}
    </div>
  );
};

export default BarChart;
