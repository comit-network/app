import React, { useEffect, useState } from 'react';
import { Card, Heading } from 'rimble-ui';
import { loadEnvironment, getNode } from '../utils/comit';
import SwapForm from './SwapForm';

export default function HomePage() {
  const [rate, setRate] = useState('Loading...');
  const [maker, setMaker] = useState({});
  const [taker, setTaker] = useState({});

  useEffect(() => {
    async function fetchMaker() {
      const res = await fetch('http://localhost:3000/');
      const { peerId, addressHint, ETHAddress, BTCAddress } = await res.json();
      setMaker({ peerId, addressHint, ETHAddress, BTCAddress });
    }
    async function fetchTaker() {
      const t = await getNode(1, 'Taker');
      const { peerId, addressHint } = t;
      const ETHAddress = await t.ethereumWallet.getAccount();
      const BTCAddress = await t.bitcoinWallet.getAddress();
      setTaker({ peerId, addressHint, ETHAddress, BTCAddress });
    }
    async function fetchRate() {
      const res = await fetch('http://localhost:3000/rates');
      const { rates } = await res.json();
      setRate(rates.dai.btc);
    }
    loadEnvironment();
    fetchMaker();
    fetchTaker();
    fetchRate();
  }, []);

  return (
    <div data-tid="container">
      <Card>
        <Heading>Swap BTC - DAI</Heading>

        <SwapForm rate={rate} maker={maker} taker={taker} />
      </Card>
    </div>
  );
}
