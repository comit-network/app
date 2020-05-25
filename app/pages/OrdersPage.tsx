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
  Radio,
  Icon,
  Button,
  Tooltip,
  Blockie,
  Modal,
  Loader
} from 'rimble-ui';
import styled from 'styled-components';

type Props = {
  history: History;
};

const Order = styled(Card)`
  display: flex;
  width: 800px;
  padding: 0px;
  border: 1px solid none;
  border-radius: 4px;

  &:hover {
    border: 1px solid blue;
    cursor: pointer;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const Panel = styled.div`
  width: 300px;
  color: #206790;
  background-color: #eaf6fd;
  border: 1px solid #36adf1;
  border-radius: 4px;
  margin: 10px;
  margin-right: 0px;
  padding: 5px 10px;
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
      <Flex justifyContent="space-between">
        <Heading textAlign="center">Available Orders</Heading>

        <Box mr={[0, 3]} mb={[3, 0]}>
          <Loader style={{ display: 'inline-block' }} mr={2} size="0.7em" />
          <Text style={{ display: 'inline-block' }} color="gray">
            Syncing...
          </Text>
        </Box>

        <Button.Outline>
          <Icon name="Notifications" />{' '}
        </Button.Outline>
      </Flex>
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
                options={[
                  { value: 'rate-asc', label: 'Best Rate' },
                  { value: 'date-asc', label: 'Expiring Soon' }
                ]}
              />
            </Field>

            <Field label="Filter by trading pair">
              <Radio required checked label="All" my={2} />
              <Radio label="BTC to DAI" my={2} />
              <Radio label="DAI to BTC" my={2} />
            </Field>
          </Box>
        </Flex>

        <Flex flex="3">
          <Box width="100%">
            <Order onClick={openModal}>
              <Panel
                my={3}
                style={{
                  color: '#975e18',
                  backgroundColor: '#fef5e9',
                  borderColor: '#FD9D28'
                }}
              >
                <Text bold fontSize="1.2em">
                  <small style={{ fontSize: '70%' }}>DAI</small> 500
                </Text>
              </Panel>

              <Box
                style={{
                  marginTop: '20px',
                  marginBottom: '-20px',
                  marginLeft: '10px'
                }}
              >
                <Icon name="KeyboardArrowRight" />
              </Box>

              <Panel my={3} variant="info">
                <Text bold fontSize="1.2em">
                  <small style={{ fontSize: '70%' }}>BTC</small> 0.21345
                </Text>
              </Panel>

              <Panel
                my={3}
                style={{
                  background: 'none',
                  width: '100%',
                  marginRight: '0px',
                  borderStyle: 'none'
                }}
              >
                <Pill color="green">5 minutes left</Pill>
              </Panel>

              <Panel
                my={2}
                style={{
                  background: 'none',
                  borderStyle: 'none',
                  width: 'auto',
                  padding: '4px',
                  margin: '10px'
                }}
              >
                <Blockie
                  opts={{
                    seed: 'foo',
                    color: '#dfe',
                    bgcolor: '#a71',
                    size: 15,
                    scale: 2,
                    spotcolor: '#000'
                  }}
                />
              </Panel>
            </Order>
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
            <Heading.h3>Fill Order</Heading.h3>

            <Card mt={3} mb={3}>
              <Tooltip message="Maker ID: 12345678" placement="top">
                <Flex
                  style={{
                    justifyContent: 'center',
                    marginBottom: '10px'
                  }}
                >
                  <Blockie
                    opts={{
                      seed: 'foo',
                      color: '#dfe',
                      bgcolor: '#a71',
                      size: 15,
                      scale: 3,
                      spotcolor: '#000'
                    }}
                  />
                </Flex>
              </Tooltip>
              <Flex mt={3} justifyContent="center">
                <Button icon="NotificationsActive">Subscribed</Button>
              </Flex>
            </Card>

            <Flex justifyContent="space-evenly">
              <Panel
                my={3}
                style={{
                  color: '#975e18',
                  backgroundColor: '#fef5e9',
                  borderColor: '#FD9D28',
                  padding: '20px'
                }}
              >
                <Text textAlign="center">You will pay</Text>

                <Text mb="-5px" fontSize="0.8em" textAlign="center">
                  DAI
                </Text>
                <Text bold fontSize="1.4em" textAlign="center">
                  500
                </Text>
              </Panel>

              <Panel
                my={3}
                style={{
                  padding: '20px'
                }}
                variant="info"
              >
                <Text textAlign="center">You will receive</Text>

                <Text mb="-5px" fontSize="0.8em" textAlign="center">
                  BTC
                </Text>
                <Text bold fontSize="1.4em" textAlign="center">
                  0.21345
                </Text>
              </Panel>
            </Flex>

            <Text>
              Rate: <strong>1BTC = 5982.12348 DAI</strong>
            </Text>

            <Text>This rate will expire in 5 minutes 12 seconds.</Text>
          </Box>

          <Flex
            px={4}
            py={3}
            borderTop={1}
            borderColor="#E8E8E8"
            flexDirection="column"
          >
            <Flex justifyContent="flex-end">
              <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
              <Button ml={3}>Fill Order</Button>
            </Flex>
          </Flex>
        </Card>
      </Modal>
    </Box>
  );
}
