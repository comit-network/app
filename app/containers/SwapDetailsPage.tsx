import _ from 'lodash';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Box, Text, Heading, Button, Flex, Loader } from 'rimble-ui';
import { toBitcoin } from 'satoshi-bitcoin-ts';
import routes from '../constants/routes.json';
import { runTakerNextStep } from '../utils/comit';

const POLL_INTERVAL = 5000; // TODO: move to .env

// TODO: extract useInterval hook to utils
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, delay); // eslint-disable-line
    return () => clearInterval(id);
  }, [delay]);
}

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
    // TODO: do nothing if a transaction is already sent out not too long ago

    async function fetchSwap(swapId) {
      // TODO: add MAKER_URL to application-level .env
      // TODO: refactor with taker.comitClient.retrieveSwapById(swapId) ?
      const res = await fetch(`http://localhost:3000/swaps/${swapId}`);
      const { swap: s } = await res.json();
      setSwap(s);
    }
    async function pollSwap(swapId) {
      console.log('runTakerNextStep');
      await runTakerNextStep(swapId);
      await fetchSwap(swapId);
    }
    pollSwap(id);
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
          <Flex
            p={3}
            borderBottom="1px solid gray"
            borderColor="moon-gray"
            alignItems="center"
            flexDirection={['column', 'row']}
          >
            <Box
              position="relative"
              height="2em"
              width="2em"
              mr={[0, 3]}
              mb={[3, 0]}
            >
              <Box position="absolute" top="0" left="0">
                <Loader size="2em" />
              </Box>
            </Box>
            <Box>
              <Text
                textAlign={['center', 'left']}
                fontWeight="600"
                fontSize={1}
                lineHeight="1.25em"
              >
                Waiting for confirmation...
              </Text>
            </Box>
          </Flex>
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
                You will receive{' '}
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
