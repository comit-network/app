import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createActor } from 'comit-sdk';
import { useBitcoinWallet } from './useBitcoinWallet';
import { useEthereumWallet } from './useEthereumWallet';

export const TakerContext = createContext({});

// TODO: can add props here for e.g. Ethereum wallet uris, cnd uris
// ({ params, children })
// TODO: extract the process.env references below into props
export const TakerProvider: React.FunctionComponent = ({ children }) => {
  const {
    wallet: bitcoinWallet,
    loaded: bitcoinWalletLoaded
  } = useBitcoinWallet();
  const {
    wallet: ethereumWallet,
    loaded: ethereumWalletLoaded
  } = useEthereumWallet();
  const [taker, setTaker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function initializeTaker() {
      setLoading(true);

      const t = await createActor(
        bitcoinWallet,
        ethereumWallet,
        process.env.HTTP_URL_CND_1,
        'Taker'
      );

      setTaker(t);
      setLoading(false);
      setLoaded(true);
    }
    if (bitcoinWalletLoaded && ethereumWalletLoaded) initializeTaker();
  }, [bitcoinWalletLoaded, ethereumWalletLoaded]);

  // Public API
  const value = { taker, loading, loaded };

  return (
    <TakerContext.Provider value={value}>{children}</TakerContext.Provider>
  );
};

TakerProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Basically a useActor('1', 'Taker');
export const useTaker = () => useContext(TakerContext);
