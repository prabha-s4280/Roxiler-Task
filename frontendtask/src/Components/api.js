import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const fetchTransactions = (params) => {
  return axios.get(`${API_BASE_URL}/transactions`, { params });
};

export const fetchStatistics = (month) => {
  return axios.get(`${API_BASE_URL}/statistics`, { params: { month } });
};

export const fetchBarChartData = (month) => {
  return axios.get(`${API_BASE_URL}/bar-chart`, { params: { month } });
};
