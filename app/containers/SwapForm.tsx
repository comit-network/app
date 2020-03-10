import React, { useEffect, useState } from 'react';
import {
  Box,
  Form,
  Pill,
  Field,
  Button,
  Text,
  Flex,
  Card,
  Heading,
  Input
} from 'rimble-ui';
import { loadEnvironment } from '../services/comit';

type Props = {
  rate: number;
};

export default function SwapForm(props: Props) {
  const { rate } = props;
  const [formValidated, setFormValidated] = useState(false);
  const [BTCValue, setBTCValue] = useState(0);
  const [DAIValue, setDAIValue] = useState(0);

  const convertToDAI = btc => {
    return btc * (1 / rate);
  };

  const convertToBTC = dai => {
    return dai * rate;
  };

  const onBTCChange = e => {
    const btc = parseFloat(e.target.value);

    setBTCValue(btc);
    setDAIValue(convertToDAI(btc));
  };

  const handleDAIChange = e => {
    const dai = parseFloat(e.target.value);

    setDAIValue(dai);
    setBTCValue(convertToBTC(dai));
  };

  const validateForm = () => {
    // Perform advanced validation here
    if (BTCValue > 0 && DAIValue > 0) {
      setFormValidated(true);
    } else {
      setFormValidated(false);
    }
  };

  useEffect(() => {
    validateForm();
  });

  const handleSubmit = e => {
    e.preventDefault();
    const swap = {
      BTCValue,
      DAIValue,
      rate
    };

    loadEnvironment();
    console.log(process.env);
    // TODO: initializeTaker

    // TODO: createSwap(maker.peerId, maker.addressHint)
    console.log(swap); // prettier-ignore
  };

  return (
    <Box p={4}>
      <Box>
        <Form onSubmit={handleSubmit} validated={formValidated}>
          <Flex mx={-3} flexWrap="wrap">
            <Box width={[1, 1, 1 / 2]} px={3}>
              <Field label="BTC to send" width={1}>
                <Input
                  type="number"
                  required
                  onChange={onBTCChange}
                  value={BTCValue}
                  width={1}
                  step="0.1"
                />
              </Field>
            </Box>
            <Box width={[1, 1, 1 / 2]} px={3}>
              <Field label="DAI to receive" width={1}>
                <Input
                  type="number"
                  required
                  onChange={handleDAIChange}
                  value={DAIValue}
                  width={1}
                />
              </Field>
            </Box>
          </Flex>
          <Pill style={{ margin: '10px 0px' }}>
            Rate: 1 BTC = {(1 / rate).toFixed(4)} DAI
          </Pill>
          <Button
            style={{ width: '100%' }}
            type="submit"
            disabled={!formValidated}
            icon="SwapHoriz"
          >
            Swap
          </Button>
        </Form>
      </Box>
      <Card my={4}>
        <Heading as="h4">Form values</Heading>
        <Text>Form validated: {formValidated.toString()}</Text>
        <Text>BTC value: {BTCValue}</Text>
        <Text>DAI value: {DAIValue}</Text>
      </Card>
    </Box>
  );
}
