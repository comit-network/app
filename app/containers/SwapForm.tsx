import React, { useEffect, useState } from 'react';
import {
  Box,
  Form,
  Flash,
  Field,
  Button,
  Flex,
  Input,
  Loader
} from 'rimble-ui';
import { buildSwap } from '../comit';

const BTC_DECIMALS = 8;

type Props = {
  rate: number;
};

export default function SwapForm(props: Props) {
  const { rate, maker, taker, onSwapSent } = props;
  const [formValidated, setFormValidated] = useState(false);
  const [BTCAmount, setBTCAmount] = useState(0);
  const [DAIAmount, setDAIAmount] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    // Perform advanced validation here
    const nonZeroAmounts = BTCAmount > 0 && DAIAmount > 0;
    const isValidBTCDecimals = countDecimals(BTCAmount) <= BTC_DECIMALS;

    if (nonZeroAmounts && isValidBTCDecimals) {
      setFormValidated(true);
    } else {
      // TODO: setFormError to display the specific validation error
      setFormValidated(false);
    }
  };

  useEffect(() => {
    validateForm();
  });

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = buildSwap(
      maker.peerId,
      maker.addressHint,
      taker.ETHAddress,
      DAIAmount,
      BTCAmount
    );

    setLoading(true);
    const swap = await taker.client.sendSwap(payload);
    const {
      properties: { id: swapId }
    } = await swap.fetchDetails();
    setLoading(false);
    onSwapSent(swapId);
  };

  return (
    <Box>
      <Form onSubmit={handleSubmit} validated={formValidated}>
        <Flex mx={-3} flexWrap="wrap">
          <Box width={[1, 1, 1 / 2]} px={3}>
            <Field label="DAI to send" width={1}>
              <Input
                type="number"
                required
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
                onChange={onBTCChange}
                value={BTCAmount}
                width={1}
                step="0.1"
              />
            </Field>
          </Box>
        </Flex>
        <Flash my={3} variant="info">
          Rate: 1 BTC = {(1 / rate).toFixed(4)} DAI
        </Flash>
        <Button
          style={{ width: '100%' }}
          type="submit"
          disabled={!formValidated || loading}
        >
          {loading ? <Loader color="white" /> : null} Start Swap
        </Button>
      </Form>
    </Box>
  );
}
