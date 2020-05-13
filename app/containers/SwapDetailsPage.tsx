import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Box, Text, Heading, Button, Flex, Loader } from 'rimble-ui';
import { toBitcoin } from 'satoshi-bitcoin-ts';
import routes from '../constants/routes.json';
import { fetchPropertiesById, TakerStateMachine } from '../comit';
import { useComitClient } from '../hooks/useComitClient';
import useInterval from '../utils/useInterval';
import SwapProgress from '../components/SwapProgress';

export default function SwapDetailsPage() {
  const { id } = useParams();
  const { comitClient, loaded: clientLoaded } = useComitClient();

  const [swap, setSwap] = useState();
  const [nextAction, setNextAction] = useState(false);
  const [sendingAction, setSendingAction] = useState(false);
  const [pendingAction, setPendingAction] = useState();
  const [isRefundable, setIsRefundable] = useState();

  const pollSwap = async swapId => {
    const swp = await comitClient.retrieveSwapById(swapId);
    const sm = new TakerStateMachine(swp);

    const nextActionName = await sm.getNextActionName();
    setNextAction(nextActionName);

    const canRefund = await sm.canRefund();
    setIsRefundable(canRefund);

    const properties = await fetchPropertiesById(comitClient, swapId);
    setSwap(properties);
  };

  useEffect(() => {
    async function fetchSwap(swapId) {
      const properties = await fetchPropertiesById(comitClient, swapId);
      setSwap(properties);
    }
    if (clientLoaded) fetchSwap(id);
  }, [clientLoaded]);

  useInterval(() => {
    const swapNotDone =
      _.get(swap, 'status') === 'NEW' ||
      _.get(swap, 'status') === 'IN_PROGRESS';
    if (swapNotDone && clientLoaded && !sendingAction) {
      pollSwap(id);

      // NOTE: The SDK may need a way to track any pending transactions
      // TODO: need to check that the last submitted pendingAction transaction has been confirmed
      // TODO: need mapping to check what tx fields to check in swap before the below code is run
      // { fund: alpha_ledger.fund_tx !== null }
      setPendingAction(false);
    }
  }, process.env.POLL_INTERVAL); // Poll every 5 seconds

  const handleRefund = async e => {
    e.preventDefault();

    console.log('handle refund');
    const swp = await comitClient.retrieveSwapById(id);
    const sm = new TakerStateMachine(swp);

    setSendingAction(true);
    try {
      await sm.refund();
    } catch (error) {
      // TODO: display error to user
      console.log(error);
    }
    setSendingAction(false);
    setPendingAction('REFUND');
  };

  const handleAction = async e => {
    e.preventDefault();

    console.log('handle action');
    const swp = await comitClient.retrieveSwapById(id);
    const sm = new TakerStateMachine(swp);

    const nextActionName = await sm.getNextActionName();

    setSendingAction(true);
    try {
      await sm.next();
    } catch (error) {
      // TODO: display error to user
      console.log(error);
    }
    setSendingAction(false);
    setPendingAction(nextActionName);
  };

  const noActionsAvailable = sendingAction || nextAction === 'WAIT';

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
          <SwapProgress
            status={_.get(swap, 'status')}
            nextAction={nextAction}
            sendingAction={sendingAction}
          />
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
                {_.get(swap, 'status') === 'SWAPPED'
                  ? 'You have received '
                  : 'You will receive '}
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

          {nextAction && nextAction !== 'WAIT' ? (
            <Button onClick={handleAction} disabled={noActionsAvailable}>
              {sendingAction || pendingAction ? (
                <Text>
                  <Loader color="white" />
                </Text>
              ) : (
                nextAction
              )}
            </Button>
          ) : null}

          {isRefundable ? (
            <Button.Outline onClick={handleRefund}>
              {sendingAction || pendingAction ? (
                <Text>
                  <Loader color="white" />
                </Text>
              ) : (
                'Refund'
              )}
            </Button.Outline>
          ) : null}
        </Flex>
      </Card>

      <br />

      <Link to={routes.HOME}>
        <Button.Outline>Go back</Button.Outline>
      </Link>
    </Box>
  );
}
