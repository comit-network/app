// import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Box, Card, Heading, Text, Icon, Flex } from 'rimble-ui';
import { Btc, Eth, Dai } from '@rimble/icons';
import { formatEther } from 'ethers/utils';
import { getTaker } from '../utils/comit';
import SwapForm from './SwapForm';
import SwapList from '../components/SwapList';

// TODO: add MAKER_URL to .env
const MAKER_URL = 'http://localhost:3000';

type Props = {
  history: History;
};

export default function HomePage(props: Props) {
  const [maker, setMaker] = useState({});
  const [taker, setTaker] = useState({});
  const [swaps, setSwaps] = useState([]);
  const [BTCBalance, setBTCBalance] = useState('...');
  const [ETHBalance, setETHBalance] = useState('...');
  const [DAIBalance, setDAIBalance] = useState('...');
  const [rate, setRate] = useState('Loading...');

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
      setBTCBalance(bitcoinBalance.toFixed(2));
      setDAIBalance(erc20Balance.toNumber());
    }
    fetchBalances();
  }, []);

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
