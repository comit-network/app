import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Tooltip,
  Card,
  Box,
  Icon,
  Text,
  Heading,
  Button,
  Flex,
  Loader
} from 'rimble-ui';
import { toBitcoin } from 'satoshi-bitcoin-ts';

import routes from '../constants/routes.json';

export default function SwapDetailsPage() {
  const { id } = useParams();
  const [swap, setSwap] = useState();

  useEffect(() => {
    async function fetchSwap(swapId) {
      // TODO: add MAKER_URL to application-level .env
      const res = await fetch(`http://localhost:3000/swaps/${swapId}`);
      const { swap: s } = await res.json();
      setSwap(s);
    }
    fetchSwap(id);
  }, []);

  // TODO: useEffect to get /swaps:id

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
          <Flex
            p={3}
            borderBottom="1px solid gray"
            borderColor="moon-gray"
            alignItems="center"
            flexDirection={['column', 'row']}
          >
            <Box
              position="relative"
              height="2em"
              width="2em"
              mr={[0, 3]}
              mb={[3, 0]}
            >
              <Box position="absolute" top="0" left="0">
                <Loader size="2em" />
              </Box>
            </Box>
            <Box>
              <Text
                textAlign={['center', 'left']}
                fontWeight="600"
                fontSize={1}
                lineHeight="1.25em"
              >
                Waiting for confirmation...
              </Text>
            </Box>
          </Flex>
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
                You will receive{' '}
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
            bg="light-gray"
            p={[2, 3]}
            borderBottom="1px solid gray"
            borderColor="moon-gray"
            flexDirection={['column', 'row']}
          >
            <Text
              textAlign={['center', 'left']}
              color="near-black"
              fontWeight="bold"
            >
              Deploy tx successful
            </Text>
            <a
              href={`https://rinkeby.etherscan.io/address/${'TODO'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Tooltip message="0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A">
                <Flex
                  justifyContent={['center', 'auto']}
                  alignItems="center"
                  flexDirection="row-reverse"
                >
                  <Text fontWeight="bold">0xAc03...1e5A</Text>
                  <Flex
                    mr={2}
                    p={1}
                    borderRadius="50%"
                    bg="primary-extra-light"
                    height="2em"
                    width="2em"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon color="primary" name="RemoveRedEye" size="1em" />
                  </Flex>
                </Flex>
              </Tooltip>
            </a>
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
              Expires in
            </Text>
            <Text color="mid-gray">Less than 2 minutes</Text>
          </Flex>
        </Flex>
      </Card>

      <br />

      <Link to={routes.HOME}>
        <Button.Outline>Go back</Button.Outline>
      </Link>
    </Box>
  );
}
