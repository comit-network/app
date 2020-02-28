import React, { useEffect, useState } from 'react';
import {
  Box,
  Form,
  Input,
  Field,
  Button,
  Text,
  Flex,
  Card,
  Heading
} from 'rimble-ui';

type Props = {
  rate: number;
};

export default function SwapForm(props: Props) {
  const { rate } = props;
  const [formValidated, setFormValidated] = useState(false);
  const [BTCValue, setBTCValue] = useState(0);
  const [DAIValue, setDAIValue] = useState(0);

  const validateInput = e => {
    e.target.parentNode.classList.add('was-validated');
  };

  const convertToDAI = btc => {
    return btc * (1 / rate);
  };

  const convertToBTC = dai => {
    return dai * rate;
  };

  const onBTCChange = e => {
    const btc = e.target.value;

    setBTCValue(btc);
    setDAIValue(convertToDAI(btc));
    validateInput(e); // TODO: toggle validation display with field-specific validation functions
  };

  const handleDAIChange = e => {
    const dai = e.target.value;

    setDAIValue(dai);
    setBTCValue(convertToBTC(dai));
    validateInput(e);
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
      DAIValue
    };
    console.log(swap);
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
                  required // set required attribute to use brower's HTML5 input validation
                  onChange={onBTCChange}
                  value={BTCValue}
                  width={1}
                  placeholder="0.2345"
                  step="0.1"
                />
              </Field>
            </Box>
            <Box width={[1, 1, 1 / 2]} px={3}>
              <Field label="DAI to receive" width={1}>
                <Form.Input
                  type="number"
                  required // set required attribute to use brower's HTML5 input validation
                  onChange={handleDAIChange}
                  value={DAIValue}
                  width={1}
                />
              </Field>
            </Box>
          </Flex>
          <Text>Rate: 1 BTC = {(1 / rate).toFixed(4)} DAI</Text>
          <Box>
            {/* Use the validated state to update UI */}
            <Button type="submit" disabled={!formValidated}>
              Swap
            </Button>
          </Box>
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
