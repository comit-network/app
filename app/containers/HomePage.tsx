import React, { useEffect, useState } from 'react';
import { Box, Card, Heading } from 'rimble-ui';
import { getTaker } from '../utils/comit';
import SwapForm from './SwapForm';
import SwapList from '../components/SwapList';
import Balances from './Balances';

// TODO: add MAKER_URL to .env
const MAKER_URL = 'http://localhost:3000';

type Props = {
  history: History;
};

export default function HomePage(props: Props) {
  const [maker, setMaker] = useState({});
  const [taker, setTaker] = useState({});
  const [swaps, setSwaps] = useState([]);
  const [rate, setRate] = useState('Loading...');

  useEffect(() => {
    async function fetchMaker() {
      const res = await fetch(MAKER_URL);
      const { peerId, addressHint, ETHAddress, BTCAddress } = await res.json();
      setMaker({ peerId, addressHint, ETHAddress, BTCAddress });
    }
    fetchMaker();
  }, []);

  useEffect(() => {
    async function fetchTaker() {
      const t = await getTaker();
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
    async function fetchSwaps() {
      const res = await fetch(`${MAKER_URL}/swaps`);
      const { swaps: allSwaps } = await res.json();
      setSwaps(allSwaps);
    }
    fetchSwaps();
  }, []);

  useEffect(() => {
    async function fetchRate() {
      const res = await fetch(`${MAKER_URL}/rates`);
      const { rates } = await res.json();
      setRate(rates.dai.btc);
    }
    fetchRate();
  }); // TODO: useInterval instead?

  const onSwapSent = swapId => {
    // Redirect to swap details page
    props.history.push(`/swaps/${swapId}`);
  };

  return (
    <Box>
      <Balances />

      <Card>
        <Heading textAlign="center">Swap DAI for BTC</Heading>

        <SwapForm
          rate={rate}
          maker={maker}
          taker={taker}
          onSwapSent={onSwapSent}
        />
      </Card>

      <Box p={1} mt={2}>
        <SwapList swaps={swaps} />
      </Box>
    </Box>
  );
}
