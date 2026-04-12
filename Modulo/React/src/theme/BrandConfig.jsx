import { createContext, useContext } from 'react';
import logoModulo from '../assets/logo-modulo.svg';

const defaultConfig = {
  logoSrc: logoModulo,
  logoAlt: 'Modulo',
  logoWidth: 93,
  logoHeight: 18,
  brandName: 'Modulo',
};

const BrandConfigContext = createContext(defaultConfig);

export function BrandConfigProvider({ config = defaultConfig, children }) {
  return (
    <BrandConfigContext.Provider value={{ ...defaultConfig, ...config }}>
      {children}
    </BrandConfigContext.Provider>
  );
}

export function useBrandConfig() {
  return useContext(BrandConfigContext);
}
