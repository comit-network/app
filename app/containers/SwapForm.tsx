import React, { useEffect, useState } from 'react';
import { Box, Form, Pill, Field, Button, Flex, Input, Loader } from 'rimble-ui';
import { buildSwap } from '../utils/comit';

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
    return dai * rate;
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

  const validateForm = () => {
    // Perform advanced validation here
    if (BTCAmount > 0 && DAIAmount > 0) {
      setFormValidated(true);
    } else {
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
    const { properties: swapDetails } = await swap.fetchDetails();
    setLoading(false);

    console.log(swapDetails);
    onSwapSent(swapDetails); // TODO: we may not need this if we can get the swap from Maker /swaps
  };

  // if (sendSwap) completed, redirect to swap status page

  return (
    <Box p={4}>
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
          <Pill color="primary" style={{ margin: '10px 0px' }}>
            Rate: 1 BTC = {(1 / rate).toFixed(4)} DAI
          </Pill>
          <Button
            style={{ width: '100%' }}
            type="submit"
            disabled={!formValidated || loading}
          >
            {loading ? <Loader color="white" /> : null} Start Swap
          </Button>
        </Form>
      </Box>
    </Box>
  );
}
