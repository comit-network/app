import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { Swap } from 'comit-sdk';
import { Box, Icon, Text, Table, Pill, Button } from 'rimble-ui';
import { Link } from 'react-router-dom';
import { toBitcoin } from 'satoshi-bitcoin-ts';
import routes from '../constants/routes.json';
import { fetchProperties } from '../comit';

type Props = {
  swaps: Swap[];
};

// Note: currencies are hardcoded for now
export default function SwapList(props: Props) {
  // TODO: Since Swap is mutable, instead of passing as props, should be
  // loaded into a global context instead

  const { swaps } = props;
  const [swapsProperties, setSwapsProperties] = useState([]);

  useEffect(() => {
    async function load() {
      const properties = await fetchProperties(swaps);
      setSwapsProperties(properties);
    }
    load();
  }, [swaps]);

  const rows = _.map(swapsProperties, s => (
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

  if (rows.length <= 0) {
    return null;
  }

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
