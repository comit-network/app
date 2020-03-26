import _ from 'lodash';
import React from 'react';
import { Box, Icon, Text, Table, Pill, Button } from 'rimble-ui';
import { Link } from 'react-router-dom';
import { toBitcoin } from 'satoshi-bitcoin-ts';
import routes from '../constants/routes.json';

type Props = {
  swaps: Record[];
};

// Note: currencies are hardcoded for now
export default function SwapList(props: Props) {
  const { swaps } = props;
  const rows = _.map(swaps, s => (
    <tr key={s.id}>
      <td>
        {(_.get(s, 'parameters.alpha_asset.quantity') / 10 ** 18)
          .toFixed(2)
          .toString()}{' '}
        DAI → {toBitcoin(_.get(s, 'parameters.beta_asset.quantity'))} BTC
      </td>
      <td>
        <Pill>{s.status}</Pill>
      </td>
      <td>
        <Link to={`${routes.SWAPS}/${s.id}`}>
          <Button.Outline>View</Button.Outline>
        </Link>
      </td>
    </tr>
  ));

  return (
    <Box>
      <Text
        caps
        fontSize={0}
        fontWeight={4}
        mt={3}
        display="flex"
        alignItems="center"
      >
        <Icon name="SwapHoriz" mr={2} />
        My Swaps
      </Text>
      <br />
      <Table>
        <thead>
          <tr>
            <th>Swap</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Box>
  );
}
