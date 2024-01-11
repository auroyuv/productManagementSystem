import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';


const Dashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState([]);
  const storedToken = localStorage.getItem('token');

  Chart.register(...registerables);

  useEffect(() => {
    axios
      .get('http://localhost:3002/product/getProductDetails', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((response) => {
        setProductCount(response.data.count);
        setCategoryCount(response.data.category);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [storedToken]);

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const chartData = {
    labels: Object.keys(categoryCount),
    datasets: [
      {
        label: 'Category Count',
        data: Object.values(categoryCount),
        backgroundColor: Object.keys(categoryCount).map(() => generateRandomColor()),
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          generateLabels: () => [],
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Admin Dashboard</h1>

      <section className="dashboard-section">
        <h2 className="section-heading">Product Overview</h2>
        <p className="dashboard-text">Total Products: {productCount}</p>
      </section>

      <section className="dashboard-section">
        <h2 className="section-heading">Product Categories</h2>
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
