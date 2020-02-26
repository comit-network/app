import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Home.css';

export default function Home() {
  const [rate, setRate] = useState('TODO');

  useEffect(() => {
    async function fetchRate() {
      const res = await fetch('http://localhost:3000/example');
      const text = await res.text();
      // console.log(text);
      setRate(text);
    }
    fetchRate();
  }, []);

  return (
    <div className={styles.container} data-tid="container">
      <h2>Home</h2>
      <p>
        Rate:
        {rate}
      </p>

      <Link to={routes.COUNTER}>to Counter</Link>
    </div>
  );
}
