import React, { useEffect, useState } from 'react';
import { Card, Heading } from 'rimble-ui';

export default function SwapDetailsPage() {
  const { id } = useParams();
  // TODO: loading screen for polling

  return (
    <div data-tid="container">
      <Card>
        <Heading>SwapDetailsPage {id}</Heading>
      </Card>
    </div>
  );
}
