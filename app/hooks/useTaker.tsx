import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getTaker } from '../comit';

export const TakerContext = createContext({});

export const TakerProvider: React.FunctionComponent = ({ children }) => {
  const [taker, setTaker] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    async function initializeTaker() {
      setLoading(true);
      const t = await getTaker();
      setTaker(t);
      setLoading(false);
      setLoaded(true);
    }
    initializeTaker();
  }, []);

  // Public API
  const value = { taker, isTakerLoading: isLoading, isTakerLoaded: isLoaded };

  return (
    <TakerContext.Provider value={value}>{children}</TakerContext.Provider>
  );
};

TakerProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useTaker = () => useContext(TakerContext);
