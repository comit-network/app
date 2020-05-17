import React, { useEffect } from 'react';
import { Text, Icon, Flex } from 'rimble-ui';
import { Btc, Eth, Dai } from '@rimble/icons';
import { formatEther } from 'ethers/utils';
import { useWalletStore } from '../hooks/useWalletStore';
import { useEthereumWallet } from '../hooks/useEthereumWallet';
import { useBitcoinWallet } from '../hooks/useBitcoinWallet';
import { setBTCBalance, setDAIBalance, setETHBalance } from '../actions/wallet';

export default function WalletBalances() {
  const { state, dispatch } = useWalletStore();
  const {
    wallet: ethereumWallet,
    loaded: ethereumWalletLoaded
  } = useEthereumWallet();
  const {
    wallet: bitcoinWallet,
    loaded: bitcoinWalletLoaded
  } = useBitcoinWallet();

  // TODO: should poll regularly
  // https://github.com/aragon/use-wallet/blob/5eab5bde3a3517be5d0d78966328d5c86355b199/src/index.js#L78-L114
  useEffect(() => {
    async function fetchBalances() {
      const bitcoinBalance = await bitcoinWallet.getBalance();
      dispatch(setBTCBalance(bitcoinBalance));

      const ethBalance = await ethereumWallet.getBalance();
      dispatch(setETHBalance(parseFloat(formatEther(ethBalance))));

      const erc20Balance = await ethereumWallet.getErc20Balance(
        process.env.ERC20_CONTRACT_ADDRESS
      );
      dispatch(setDAIBalance(erc20Balance.toNumber()));

      // TOFIX: For some reason the following line is needed for bitcoin balance to be displayed correctly
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    if (ethereumWalletLoaded && bitcoinWalletLoaded) fetchBalances();
  }, [ethereumWalletLoaded, bitcoinWalletLoaded]);

  return (
    <Flex justifyContent="space-between" alignItems="center" p={2}>
      <Text
        caps
        fontSize={0}
        fontWeight={4}
        mb={3}
        display="flex"
        alignItems="center"
      >
        <Icon name="AccountBalanceWallet" mr={2} />
        My Wallet
      </Text>
      <Text fontSize={2} mb={3} position="right" display="flex">
        <Eth mr={2} /> ETH: {state.ETHBalance}
      </Text>
      <Text fontSize={2} mb={3} display="flex">
        <Dai mr={2} /> DAI: {state.DAIBalance}
      </Text>
      <Text fontSize={2} mb={3} position="right" display="flex">
        <Btc mr={2} /> BTC: {state.BTCBalance}
      </Text>
    </Flex>
  );
}
