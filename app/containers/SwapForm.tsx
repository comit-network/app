import React, { useEffect, useState, useReducer } from 'react';
import {
  Box,
  Form,
  Flash,
  Field,
  Button,
  Flex,
  Input,
  Loader,
  Icon,
  Text
} from 'rimble-ui';
import { buildSwap } from '../comit';
import MakerService from '../services/makerService';
import { useEthereumWallet } from '../hooks/useEthereumWallet';
import { useComitClient } from '../hooks/useComitClient';
import useFetch from '../hooks/useFetch';

const BTC_DECIMALS = 8;

type Props = {
  rate: number;
};

export default function SwapForm(props: Props) {
  const { onSwapSent } = props;

  const makerService = new MakerService(process.env.MAKER_URL);
  const { isLoading: isLoadingMaker, data: maker } = useFetch(async () =>
    makerService.getIdentity()
  );
  const {
    isLoading: isLoadingRate,
    data: rate,
    refetch: refreshRate
  } = useFetch(async () => makerService.getRate('dai.btc'), 'Loading...');

  const { wallet: ethereumWallet, loaded: walletLoaded } = useEthereumWallet();
  const { comitClient, loaded: clientLoaded } = useComitClient();

  const [formValidated, setFormValidated] = useState(false);
  const [BTCAmount, setBTCAmount] = useState(0);
  const [DAIAmount, setDAIAmount] = useState(0);
  const [sendingSwap, setSendingSwap] = useState(false);

  const convertToDAI = btc => {
    return btc * (1 / rate);
  };

  const convertToBTC = dai => {
    return (dai * rate).toFixed(BTC_DECIMALS);
  };

  const onBTCChange = e => {
    const btc = parseFloat(e.target.value);

    setBTCAmount(btc);
    setDAIAmount(convertToDAI(btc));
  };

  const handleDAIChange = e => {
    const dai = parseFloat(e.target.value);

    setDAIAmount(dai);
    setBTCAmount(convertToBTC(dai));
  };

  const countDecimals = value => {
    if (Number.isNaN(value)) return 0;
    if (Math.floor(value) === value) return 0;
    const places = value.toString().split('.');
    if (places.length <= 1) return 0;
    return places[1].length || 0;
  };

  // Form validation
  const validateForm = () => {
    const nonZeroAmounts = BTCAmount > 0 && DAIAmount > 0;
    const isValidBTCDecimals = countDecimals(BTCAmount) <= BTC_DECIMALS;

    // TODO: validate DAI Amount against DAI wallet balance

    if (nonZeroAmounts && isValidBTCDecimals) {
      setFormValidated(true);
    } else {
      // TODO: setFormError to display the specific validation error
      setFormValidated(false);
    }
  };

  useEffect(() => {
    validateForm();
  }, [BTCAmount, DAIAmount]);

  useEffect(() => {
    async function recalculate() {
      setBTCAmount(convertToBTC(DAIAmount));
    }
    if (BTCAmount > 0) recalculate();
  }, [rate]);

  const handleSubmit = async e => {
    // TODO: display submission errors

    const refundAddress = await ethereumWallet.getAccount();
    const payload = buildSwap(
      maker.peerId,
      maker.addressHint,
      refundAddress,
      DAIAmount,
      BTCAmount
    );
    setSendingSwap(true);
    const swap = await comitClient.sendSwap(payload);
    const {
      properties: { id: swapId }
    } = await swap.fetchDetails();
    setSendingSwap(false);
    onSwapSent(swapId);
  };

  if (!walletLoaded || !clientLoaded) {
    return (
      <Box>
        <Loader color="blue" />
      </Box>
    );
  }

  return (
    <Box>
      <Form onSubmit={e => e.preventDefault()} validated={formValidated}>
        <Flex mx={-3} flexWrap="wrap">
          <Box width={[1, 1, 1 / 2]} px={3}>
            <Field label="DAI to send" width={1}>
              <Input
                type="number"
                required
                disabled={isLoadingRate}
                onChange={handleDAIChange}
                value={DAIAmount}
                width={1}
              />
            </Field>
          </Box>
          <Box width={[1, 1, 1 / 2]} px={3}>
            <Field label="BTC to receive" width={1}>
              <Input
                type="number"
                required
                disabled={isLoadingRate}
                onChange={onBTCChange}
                value={BTCAmount}
                width={1}
                step="0.1"
              />
            </Field>
          </Box>
        </Flex>
        <Flash my={3} variant="info">
          <Flex justifyContent="space-between">
            <Text>Rate: 1 BTC = {(1 / rate).toFixed(4)} DAI</Text>
            {isLoadingRate ? (
              <Loader />
            ) : (
              <Icon name="Refresh" onClick={refreshRate} />
            )}
          </Flex>
        </Flash>
        <Button
          style={{ width: '100%' }}
          type="submit"
          disabled={
            !formValidated || sendingSwap || isLoadingMaker || isLoadingRate
          }
          onClick={handleSubmit}
        >
          {sendingSwap ? <Loader color="white" /> : null} Start Swap
        </Button>
      </Form>
    </Box>
  );
}
