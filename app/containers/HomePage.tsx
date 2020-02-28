import React, { useEffect, useState } from 'react';
import { Card, Button, Heading, Text } from 'rimble-ui';
import SwapForm from './SwapForm';

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
      <Card>
        <Heading>Swap BTC - DAI</Heading>

        <SwapForm rate={rate} />
      </Card>
    </div>
  );
}
