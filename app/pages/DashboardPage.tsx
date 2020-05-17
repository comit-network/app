import React from 'react';
import { Select, Flex, Box, Card, Text, Heading, Button } from 'rimble-ui';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

type Props = {
  history: History;
};

const Square = styled(Box)`
  background: #eee;
  padding: 10px 20px;
  margin-bottom: 10px;
`;

export default function DashboardPage() {
  return (
    <Box>
      <Flex alignItems="center" justifyContent="center">
        <Box width="65%" padding="12px" background="#ededed">
          <Square>
            <Flex alignItems="center" justifyContent="space-between">
              <Text textAlign="center">I Want to Trade</Text>
              <Select
                required
                options={[
                  { value: 'dai', label: 'DAI' },
                  { value: 'btc', label: 'BTC' }
                ]}
              />
            </Flex>
          </Square>

          <Square>
            <Flex alignItems="center" justifyContent="space-between">
              <Text textAlign="center">I Want to Receive</Text>
              <Select
                required
                options={[
                  { value: 'btc', label: 'BTC' },
                  { value: 'dai', label: 'DAI' }
                ]}
              />
            </Flex>
          </Square>

          <Link
            style={{
              display: 'block',
              marginTop: '15%'
            }}
            to="/orders"
          >
            <Button width="100%">View Orders</Button>
          </Link>
        </Box>
      </Flex>
    </Box>
  );
}
