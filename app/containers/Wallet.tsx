import React, { useEffect } from 'react';
import { Text, Icon, Flex } from 'rimble-ui';
import { Btc, Eth, Dai } from '@rimble/icons';
import { formatEther } from 'ethers/utils';
import { useWalletStore } from '../hooks/useWalletStore';
import { useTaker } from '../hooks/useTaker';
import { setBTCBalance, setDAIBalance, setETHBalance } from '../actions/wallet';

export default function Wallet() {
  const { state, dispatch } = useWalletStore();
  const { taker, loaded } = useTaker();

  // TODO: refactor to useWallet hook?
  useEffect(() => {
    async function fetchBalances() {
      const bitcoinBalance = await taker.bitcoinWallet.getBalance();
      dispatch(setBTCBalance(bitcoinBalance));

      const ethBalance = await taker.ethereumWallet.getBalance();
      dispatch(setETHBalance(parseFloat(formatEther(ethBalance))));

      const erc20Balance = await taker.ethereumWallet.getErc20Balance(
        process.env.ERC20_CONTRACT_ADDRESS
      );
      dispatch(setDAIBalance(erc20Balance.toNumber()));

      // TOFIX: For some reason the following line is needed for bitcoin balance to be displayed correctly
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    if (loaded) fetchBalances();
  }, [loaded]);

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
