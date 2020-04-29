import React, { useEffect, useState } from 'react';
import { Box, Card, Heading } from 'rimble-ui';
import { getSwaps } from '../comit';
import SwapForm from './SwapForm';
import SwapList from '../components/SwapList';
import WalletBalances from './WalletBalances';
import { useBitcoinWallet } from '../hooks/useBitcoinWallet';
import { useEthereumWallet } from '../hooks/useEthereumWallet';
import { useCnd } from '../hooks/useCnd';

type Props = {
  history: History;
};

export default function HomePage(props: Props) {
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

  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    async function fetchSwaps() {
      const swps = await getSwaps(cnd, bitcoinWallet, ethereumWallet);
      setSwaps(swps);
    }
    if (fullyLoaded) fetchSwaps();
  }, [cndLoaded, bitcoinWalletLoaded, ethereumWalletLoaded]);

  const onSwapSent = swapId => {
    // Redirect to swap details page
    props.history.push(`/swaps/${swapId}`);
  };

  return (
    <Box>
      <WalletBalances />

      <Card>
        <Heading textAlign="center">Swap DAI for BTC</Heading>

        <SwapForm onSwapSent={onSwapSent} />
      </Card>

      <Box p={1} mt={2}>
        <SwapList swaps={swaps} />
      </Box>
    </Box>
  );
}
