import React, { useEffect, useState } from 'react';

export default function HomePage() {
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
    <div data-tid="container">
      <h2>Home</h2>
      <p>Rate: 1 BTC = {(1 / rate).toFixed(2)} DAI</p>

      {/* <Link to="/counter">to Counter</Link> */}
    </div>
  );
}
