export const BUILDER_CODE = "bc_bthamkx9";
export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";
export const NETWORK = "base-mainnet";
export const HARDFORK = "denim";
export const BLOCK_TIME_MS = 200;

export function getAttributionData() {
  return {
    builder: BUILDER_CODE,
    attribution: ATTRIBUTION_CODE,
    network: NETWORK,
    hardfork: HARDFORK,
    blockTime: "200ms",
    canonical: true
  };
}
