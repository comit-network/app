import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createActor, EthereumWallet, InMemoryBitcoinWallet } from 'comit-sdk';

export const TakerContext = createContext({});

// TODO: can add props here for e.g. Ethereum wallet uris, cnd uris
// ({ params, children })
// TODO: extract the process.env references below into props
export const TakerProvider: React.FunctionComponent = ({ children }) => {
  const [taker, setTaker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // TODO: create useCnd hook
  // TODO: create useBitcoinWallet hook
  // TODO: create useEthereumWallet hook

  useEffect(() => {
    async function initializeTaker() {
      setLoading(true);

      const bitcoinWallet = await InMemoryBitcoinWallet.newInstance(
        'regtest',
        process.env.BITCOIN_P2P_URI,
        process.env.BITCOIN_HD_KEY_1
      );
      await new Promise(resolve => setTimeout(resolve, 1000)); // bitcoin wallet workaround

      const ethereumWallet = new EthereumWallet(
        process.env.ETHEREUM_NODE_HTTP_URL,
        process.env.ETHEREUM_KEY_1
      );

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
    initializeTaker();
  }, []);

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
