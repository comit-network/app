import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import styles from './Home.css';

export default function Home() {
  const [rate, setRate] = useState('Loading...');

  useEffect(() => {
    async function fetchRate() {
      const res = await fetch('http://localhost:3000/rates');
      const { rates } = await res.json();
      setRate(rates.dai.btc);
    }
    fetchRate();
  }, []);

  return (
    <div className={styles.container} data-tid="container">
      <h2>Home</h2>
      <p>Rate: 1 BTC = {(1 / rate).toFixed(2)} DAI</p>

      {/* <Link to="/counter">to Counter</Link> */}
    </div>
  );
}
