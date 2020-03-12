// import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Box, Card, Heading } from 'rimble-ui';
import { getNode } from '../utils/comit';
import SwapForm from './SwapForm';
import SwapList from '../components/SwapList';

export default function HomePage() {
  const [rate, setRate] = useState('Loading...');
  const [maker, setMaker] = useState({});
  const [taker, setTaker] = useState({});
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    async function fetchMaker() {
      const res = await fetch('http://localhost:3000/'); // TODO: add MAKER_URL to .env
      const { peerId, addressHint, ETHAddress, BTCAddress } = await res.json();
      setMaker({ peerId, addressHint, ETHAddress, BTCAddress });
    }
    fetchMaker();
  }, []);

  useEffect(() => {
    async function fetchSwaps() {
      const res = await fetch('http://localhost:3000/swaps'); // TODO: add MAKER_URL to .env
      const { swaps: allSwaps } = await res.json();
      setSwaps(allSwaps);
    }
    fetchSwaps();
  }, []);

  useEffect(() => {
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
    fetchTaker();
  }, []);

  useEffect(() => {
    async function fetchRate() {
      const res = await fetch('http://localhost:3000/rates');
      const { rates } = await res.json();
      setRate(rates.dai.btc);
    }
    fetchRate();
  }, []);

  const onSwapSent = swapId => {
    console.log('onSwapSent');
    console.log(swapId);
    // TODO: redirect to SwapPage /swaps/:id
  };

  return (
    <Box>
      <Card>
        <Heading textAlign="center">Swap DAI for BTC</Heading>

        <SwapForm
          rate={rate}
          maker={maker}
          taker={taker}
          onSwapSent={onSwapSent}
        />
      </Card>

      <br />

      <Box p={1}>
        <SwapList swaps={swaps} />
      </Box>
    </Box>
  );
}
