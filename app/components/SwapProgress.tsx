import React from 'react';
import { Box, Text, Flex, Loader } from 'rimble-ui';

const loader = loadingText => (
  <Flex
    p={3}
    borderBottom="1px solid gray"
    borderColor="moon-gray"
    alignItems="center"
    flexDirection={['column', 'row']}
  >
    <Box position="relative" height="2em" width="2em" mr={[0, 3]} mb={[3, 0]}>
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
        {loadingText}
      </Text>
    </Box>
  </Flex>
);

/* eslint-disable react/jsx-no-undef */
export default function SwapProgress(props: Props) {
  const { status, nextAction, sendingAction } = props;

  if (status === 'SWAPPED') {
    return null;
  }

  if (nextAction === 'WAIT') {
    return loader('Waiting for Maker...');
  }

  if (sendingAction) {
    return loader(`Performing ${nextAction} transaction...`);
  }

  if (nextAction && !sendingAction) {
    return null;
  }

  return loader('Syncing...');
}
