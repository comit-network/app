import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Box, Text, Heading, Button, Flex, Loader } from 'rimble-ui';
import { toBitcoin } from 'satoshi-bitcoin-ts';
import routes from '../constants/routes.json';
import { runTakerNextStep } from '../utils/comit';
import useInterval from '../utils/useInterval';
import SwapLoader from '../components/SwapLoader';

const POLL_INTERVAL = 5000; // TODO: move to .env

export default function SwapDetailsPage() {
  const { id } = useParams();
  const [swap, setSwap] = useState();

  useEffect(() => {
    async function fetchSwap(swapId) {
      // TODO: add MAKER_URL to application-level .env
      // TODO: refactor with taker.comitClient.retrieveSwapById(swapId) ?
      const res = await fetch(`http://localhost:3000/swaps/${swapId}`);
      const { swap: s } = await res.json();
      setSwap(s);
    }
    fetchSwap(id);
  }, []);

  useInterval(() => {
    async function fetchSwap(swapId) {
      // TODO: add MAKER_URL to application-level .env
      // TODO: refactor with taker.comitClient.retrieveSwapById(swapId) ?
      const res = await fetch(`http://localhost:3000/swaps/${swapId}`);
      const { swap: s } = await res.json();
      setSwap(s);
    }
    async function pollSwap(swapId) {
      await runTakerNextStep(swapId);
      await fetchSwap(swapId);
    }
    if (
      _.get(swap, 'status') === 'NEW' ||
      _.get(swap, 'status') === 'IN_PROGRESS'
    ) {
      // Don't poll if already done
      pollSwap(id);
    }
  }, POLL_INTERVAL); // Poll every 5 seconds

  return (
    <Box>
      <Card>
        <Heading as="h3">Tracking swap</Heading>

        <Flex
          alignItems="stretch"
          flexDirection="column"
          borderRadius={2}
          borderColor="moon-gray"
          borderWidth={1}
          borderStyle="solid"
          overflow="hidden"
          my={[3, 4]}
        >
          <Box bg="primary" px={3} py={2}>
            <Text color="white">Swap {_.get(swap, 'status')}</Text>
          </Box>
          <SwapLoader status={_.get(swap, 'status')} />
          <Flex
            justifyContent="space-between"
            bg="near-white"
            py={[2, 3]}
            px={3}
            alignItems="center"
            borderBottom="1px solid gray"
            borderColor="moon-gray"
            flexDirection={['column', 'row']}
          >
            <Text
              textAlign={['center', 'left']}
              color="near-black"
              fontWeight="bold"
            >
              Swap
            </Text>
            <Flex
              alignItems={['center', 'flex-end']}
              flexDirection={['row', 'column']}
            >
              <Text
                mr={[2, 0]}
                color="near-black"
                fontWeight="bold"
                lineHeight="1em"
              >
                You{' '}
                {_.get(swap, 'status') === 'SWAPPED'
                  ? 'have received '
                  : 'will receive '}
                {swap
                  ? toBitcoin(_.get(swap, 'parameters.beta_asset.quantity'))
                  : '...'}{' '}
                BTC
              </Text>
              <Text color="mid-gray" fontSize={1}>
                for{' '}
                {swap
                  ? _.get(swap, 'parameters.alpha_asset.quantity') /
                    10 ** (18).toFixed(2).toString()
                  : '...'}{' '}
                DAI
              </Text>
            </Flex>
          </Flex>
          <Flex
            justifyContent="space-between"
            bg="near-white"
            p={[2, 3]}
            alignItems="center"
            borderBottom="1px solid gray"
            borderColor="moon-gray"
            flexDirection={['column', 'row']}
          >
            <Text color="near-black" fontWeight="bold">
              ID
            </Text>
            <Text color="mid-gray">{_.get(swap, 'id')}</Text>
          </Flex>
          <Flex
            justifyContent="space-between"
            bg="near-white"
            p={[2, 3]}
            alignItems="center"
            flexDirection={['column', 'row']}
          >
            <Text color="near-black" fontWeight="bold">
              Alpha ledger
            </Text>
            <Text color="mid-gray">
              {_.get(swap, 'state.alpha_ledger.status')}
            </Text>
          </Flex>
          <Flex
            justifyContent="space-between"
            bg="near-white"
            p={[2, 3]}
            alignItems="center"
            flexDirection={['column', 'row']}
          >
            <Text color="near-black" fontWeight="bold">
              Beta ledger
            </Text>
            <Text color="mid-gray">
              {_.get(swap, 'state.beta_ledger.status')}
            </Text>
          </Flex>
          <Flex
            justifyContent="space-between"
            bg="near-white"
            p={[2, 3]}
            alignItems="center"
            flexDirection={['column', 'row']}
          >
            <Text color="near-black" fontWeight="bold">
              Communication
            </Text>
            <Text color="mid-gray">
              {_.get(swap, 'state.communication.status')}
            </Text>
          </Flex>
        </Flex>
      </Card>

      <br />

      <Link to={routes.HOME}>
        <Button.Outline>Go back</Button.Outline>
      </Link>
    </Box>
  );
}
