/**
 * protocol-audits.js — Mock audit data for DeFi protocols
 * Used by AuditBadge component in LendBorrowTab
 */

export const PROTOCOL_AUDITS = {
  'Aave v3': {
    firm: 'CertiK',
    year: 2024,
    tvl: '$12.4B',
    reportUrl: '#',
    summary: 'No critical issues found. 3 medium-severity findings resolved.',
  },
  'Aave': {
    firm: 'CertiK',
    year: 2024,
    tvl: '$12.4B',
    reportUrl: '#',
    summary: 'No critical issues found. 3 medium-severity findings resolved.',
  },
  'Compound': {
    firm: 'OpenZeppelin',
    year: 2023,
    tvl: '$2.1B',
    reportUrl: '#',
    summary: 'Comprehensive audit with 2 low-severity findings resolved.',
  },
  'Spark': {
    firm: 'ChainSecurity',
    year: 2024,
    tvl: '$890M',
    reportUrl: '#',
    summary: 'Full security review. No critical issues. Battle-tested codebase.',
  },
  'Stargate': {
    firm: 'Quantstamp',
    year: 2023,
    tvl: '$3.2B',
    reportUrl: '#',
    summary: 'Bridge audit completed. 1 high-severity issue resolved prior to launch.',
  },
  'Uniswap v3': {
    firm: 'Trail of Bits',
    year: 2023,
    tvl: '$4.8B',
    reportUrl: '#',
    summary: 'Industry-standard audit by Trail of Bits. No critical findings.',
  },
  'Lido': {
    firm: 'Sigma Prime',
    year: 2024,
    tvl: '$34B',
    reportUrl: '#',
    summary: 'Ongoing security review programme. Multiple audits completed.',
  },
  'Rocket Pool': {
    firm: 'Consensys Diligence',
    year: 2023,
    tvl: '$4.1B',
    reportUrl: '#',
    summary: 'Full protocol audit. All high-severity findings resolved.',
  },
  'Jito': {
    firm: 'OtterSec',
    year: 2024,
    tvl: '$2.4B',
    reportUrl: '#',
    summary: 'Solana native audit. No critical issues found.',
  },
};

export function getAuditForProtocol(protocolName) {
  return PROTOCOL_AUDITS[protocolName] || null;
}
