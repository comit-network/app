import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Card, Heading, Text } from 'rimble-ui';
import { loadEnvironment, getNode } from '../utils/comit';
import SwapForm from './SwapForm';

export default function HomePage() {
  const [rate, setRate] = useState('Loading...');
  const [maker, setMaker] = useState({});
  const [taker, setTaker] = useState({});
  const [activeSwap, setActiveSwap] = useState({});

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
      setTaker({
        peerId,
        addressHint,
        ETHAddress,
        BTCAddress,
        client: t.comitClient
      });
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

  const onSwapSent = swapDetails => {
    console.log('onSwapSent');
    console.log(swapDetails);
    setActiveSwap(swapDetails);
  };

  if (!_.isEmpty(activeSwap)) {
    return (
      <Card>
        <Heading>Confirming swap</Heading>

        <Text>{JSON.stringify(activeSwap)}</Text>
      </Card>
    );
  }

  return (
    <Card>
      <Heading>Swap DAI for BTC</Heading>

      <SwapForm
        rate={rate}
        maker={maker}
        taker={taker}
        onSwapSent={onSwapSent}
      />
    </Card>
  );
}
