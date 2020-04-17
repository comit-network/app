import React, { useEffect, useState } from 'react';
import { Box, Card, Heading } from 'rimble-ui';
import { getSwaps } from '../comit';
import SwapForm from './SwapForm';
import SwapList from '../components/SwapList';
import WalletBalances from './WalletBalances';
import MakerService from '../services/makerService';
import { useBitcoinWallet } from '../hooks/useBitcoinWallet';
import { useEthereumWallet } from '../hooks/useEthereumWallet';
import { useCnd } from '../hooks/useCnd';

type Props = {
  history: History;
};

export default function HomePage(props: Props) {
  // TODO: refactor to useMakerService
  const makerService = new MakerService(process.env.MAKER_URL);

  const {
    wallet: bitcoinWallet,
    loaded: bitcoinWalletLoaded
  } = useBitcoinWallet();
  const {
    wallet: ethereumWallet,
    loaded: ethereumWalletLoaded
  } = useEthereumWallet();
  const { cnd, loaded: cndLoaded } = useCnd();
  const fullyLoaded = cndLoaded && bitcoinWalletLoaded && ethereumWalletLoaded;

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
    async function fetchSwaps() {
      const swps = await getSwaps(cnd, bitcoinWallet, ethereumWallet);
      setSwaps(swps);
    }
    if (fullyLoaded) fetchSwaps();
  }, [cndLoaded, bitcoinWalletLoaded, ethereumWalletLoaded]);

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
      <WalletBalances />

      <Card>
        <Heading textAlign="center">Swap DAI for BTC</Heading>

        <SwapForm rate={rate} maker={maker} onSwapSent={onSwapSent} />
      </Card>

      <Box p={1} mt={2}>
        <SwapList swaps={swaps} />
      </Box>
    </Box>
  );
}
