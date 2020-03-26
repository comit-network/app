import React, { useEffect, useState } from 'react';
import { Text, Icon, Flex } from 'rimble-ui';
import { Btc, Eth, Dai } from '@rimble/icons';
import { formatEther } from 'ethers/utils';
import { getTaker } from '../utils/comit';

export default function Balances() {
  const [BTCBalance, setBTCBalance] = useState('...');
  const [ETHBalance, setETHBalance] = useState('...');
  const [DAIBalance, setDAIBalance] = useState('...');

  useEffect(() => {
    async function fetchBalances() {
      const t = await getTaker();

      // TOFIX: For some reason the following line is needed for bitcoin balance to be displayed correctly
      await new Promise(resolve => setTimeout(resolve, 1000));

      const ethBalance = await t.ethereumWallet.getBalance();
      const bitcoinBalance = await t.bitcoinWallet.getBalance();
      const erc20Balance = await t.ethereumWallet.getErc20Balance(
        process.env.ERC20_CONTRACT_ADDRESS
      );
      setETHBalance(parseFloat(formatEther(ethBalance)));
      setDAIBalance(erc20Balance.toFixed(2));
      setBTCBalance(bitcoinBalance.toFixed(2));
    }
    fetchBalances();
  }, []);

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
        <Eth mr={2} /> ETH: {ETHBalance}
      </Text>
      <Text fontSize={2} mb={3} display="flex">
        <Dai mr={2} /> DAI: {DAIBalance}
      </Text>
      <Text fontSize={2} mb={3} position="right" display="flex">
        <Btc mr={2} /> BTC: {BTCBalance}
      </Text>
    </Flex>
  );
}
