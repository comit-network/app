import React, { useState } from 'react';
import {
  Flex,
  Box,
  Field,
  Select,
  Card,
  Heading,
  Text,
  Pill,
  Flash,
  Button,
  Icon,
  Modal
} from 'rimble-ui';
import styled from 'styled-components';

type Props = {
  history: History;
};

const Panel = styled.div`
  width: 150px;
  color: #206790;
  background-color: #eaf6fd;
  border: 1px solid #36adf1;
  border-radius: 4px;
  margin: 16px 0;
  margin-right: 10px;
  padding: 16px;
`;

export default function OrdersPage() {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = e => {
    e.preventDefault();
    setIsOpen(false);
  };

  const openModal = e => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <Box>
      <Heading textAlign="center">Available Orders</Heading>
      <br />
      <br />

      <Flex>
        <Flex
          flex="1"
          style={{
            border: '1px solid #eee',
            marginRight: '10px'
          }}
        >
          <Box m="15px">
            <Field label="Sort by">
              <Select
                required
                options={[{ value: 'rate-asc', label: 'Best Rate' }]}
              />
            </Field>

            <Field label="Trade">
              <Select required options={[{ value: 'dai', label: 'DAI' }]} />
            </Field>

            <Field label="Receive">
              <Select required options={[{ value: 'btc', label: 'BTC' }]} />
            </Field>
          </Box>
        </Flex>

        <Flex flex="3">
          <Box width="100%">
            <Card
              style={{
                display: 'flex',
                padding: '0px 20px',
                width: '100%'
              }}
            >
              <Panel my={3} variant="info">
                <Text mb="-5px" fontSize="0.8em" textAlign="center">
                  BTC
                </Text>
                <Text bold fontSize="1.6em" textAlign="center">
                  0.21345
                </Text>
              </Panel>

              <Panel
                my={3}
                style={{
                  color: '#975e18',
                  backgroundColor: '#fef5e9',
                  borderColor: '#FD9D28'
                }}
              >
                <Text mb="-5px" fontSize="0.8em" textAlign="center">
                  DAI
                </Text>
                <Text bold fontSize="1.6em" textAlign="center">
                  500
                </Text>
              </Panel>

              <Panel
                my={3}
                style={{
                  background: 'none',
                  width: '100%',
                  marginRight: '0px',
                  borderStyle: 'dashed'
                }}
              >
                <Button.Outline onClick={openModal} mr={2}>
                  Take
                </Button.Outline>
                <Pill color="green">30 minutes left</Pill>
              </Panel>
            </Card>
          </Box>
        </Flex>
      </Flex>

      <Modal isOpen={isOpen}>
        <Card width="420px" p={0}>
          <Button.Text
            icononly
            icon="Close"
            color="moon-gray"
            position="absolute"
            top={0}
            right={0}
            mt={3}
            mr={3}
            onClick={closeModal}
          />

          <Box p={4} mb={3}>
            <Heading.h3>Take Order</Heading.h3>

            <Text italic>Rate: 1BTC = 5982.12348 DAI</Text>
            <Flex>
              <Panel my={3} variant="info">
                <Text textAlign="center">You will receive</Text>

                <Text mb="-5px" fontSize="0.8em" textAlign="center">
                  BTC
                </Text>
                <Text bold fontSize="1.6em" textAlign="center">
                  0.21345
                </Text>
              </Panel>

              <Panel
                my={3}
                style={{
                  color: '#975e18',
                  backgroundColor: '#fef5e9',
                  borderColor: '#FD9D28'
                }}
              >
                <Text textAlign="center">You will pay</Text>

                <Text mb="-5px" fontSize="0.8em" textAlign="center">
                  DAI
                </Text>
                <Text bold fontSize="1.6em" textAlign="center">
                  500
                </Text>
              </Panel>
            </Flex>

            <Text>This rate will expire in 5 minutes 12 seconds.</Text>

            <Text>Are you sure you want to take this order?</Text>
          </Box>

          <Flex
            px={4}
            py={3}
            borderTop={1}
            borderColor="#E8E8E8"
            justifyContent="flex-end"
          >
            <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
            <Button ml={3}>Confirm</Button>
          </Flex>
        </Card>
      </Modal>
    </Box>
  );
}
