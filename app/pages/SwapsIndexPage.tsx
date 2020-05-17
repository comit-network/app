import React, { useEffect, useState } from 'react';
import { Box, Card, Heading, Button } from 'rimble-ui';
import { Link } from 'react-router-dom';
import { getSwaps } from '../comit';
import SwapForm from '../components/SwapForm';
import SwapList from '../components/SwapList';
import WalletBalances from '../components/WalletBalances';
import { useBitcoinWallet } from '../hooks/useBitcoinWallet';
import { useEthereumWallet } from '../hooks/useEthereumWallet';
import { useCnd } from '../hooks/useCnd';

type Props = {
  history: History;
};

export default function SwapsIndexPage(props: Props) {
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

      <Link to="/orders">
        <Button.Outline>Start</Button.Outline>
      </Link>

      <Link to="/abc">
        <Button.Outline>ABC</Button.Outline>
      </Link>
    </Box>
  );
}
