import React, { useEffect, useState } from 'react';
import { fetchTransactions } from './api';
import './TransactionTable.css';

const TransactionTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const loadTransactions = async () => {
    const { data } = await fetchTransactions({
      page,
      perPage,
      month: selectedMonth,
      title: searchTerm,
    });
    setTransactions(data);
  };

  useEffect(() => {
    loadTransactions();
  }, [selectedMonth, page, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="transaction-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search transactions..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <table className="transaction-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.product_title}</td>
                <td>{transaction.description}</td>
                <td>₹{transaction.price}</td>
                <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>


      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="page-number">Page {page}</span>
        <button
          className="pagination-button"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={transactions.length < perPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
