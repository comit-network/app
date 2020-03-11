import _ from 'lodash';
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
  Input,
  EthAddress
} from 'rimble-ui';
// import { Redirect } from 'react-router-dom';
import { buildSwap } from '../utils/comit';

type Props = {
  rate: number;
};

export default function SwapForm(props: Props) {
  const { rate, maker, taker } = props;
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

  const handleSubmit = async e => {
    e.preventDefault();
    const swapPayload = buildSwap(
      maker.peerId,
      maker.addressHint,
      taker.ETHAddress,
      DAIValue,
      BTCValue
    );

    console.log(swapPayload);

    // TODO: onSubmit, call sendSwap and redirect to wait <Redirect to="/swap" />;
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
                  value={DAIValue}
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
                  value={BTCValue}
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
        <Text>DAI to send: {DAIValue}</Text>
        <Text>BTC to receive: {BTCValue}</Text>
        <br />
        <Text>Maker ETH & BTC address: </Text>
        <EthAddress address={maker.ETHAddress} />
        <EthAddress address={maker.BTCAddress} />
        <br />
        <Text>Your ETH & BTC address:</Text>
        <EthAddress address={taker.ETHAddress} />
        <EthAddress address={taker.BTCAddress} />
        {/* TODO: fork EthAddress component for bitcoin */}
      </Card>
    </Box>
  );
}
