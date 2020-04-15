import React, { useEffect, useState } from 'react';
import { Box, Card, Heading } from 'rimble-ui';
import { getTaker, getSwaps } from '../comit';
import SwapForm from './SwapForm';
import SwapList from '../components/SwapList';
import Wallet from './Wallet';
import MakerService from '../services/makerService';

type Props = {
  history: History;
};

export default function HomePage(props: Props) {
  const makerService = new MakerService(process.env.MAKER_URL);
  const [taker, setTaker] = useState({});

  // TODO: refactor below to use hooks, enable switching makers eventually
  const [maker, setMaker] = useState({});
  const [swaps, setSwaps] = useState([]);
  const [rate, setRate] = useState('Loading...');

  useEffect(() => {
    async function fetchMaker() {
      const {
        peerId,
        addressHint,
        ETHAddress,
        BTCAddress
      } = await makerService.getIdentity();
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
      const swps = await getSwaps();
      setSwaps(swps);
    }
    fetchSwaps();
  }, []);

  useEffect(() => {
    async function fetchRate() {
      const rates = await makerService.getRates();
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
      <Wallet />

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
