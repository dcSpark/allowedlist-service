export type MilkomedaStargateAsset = {
  idCardano: string; // 0-right-padded fingerprint
  idMilkomeda: string; // ERC20 contract address
  minCNTInt?: string; // min amount of Cardano Native Token
  minGWei?: string; // optional - whatever GWei conversion is
  cardanoFingerprint: string; // cardano fingerprint of the asset "asset.."
  cardanoDecimals?: number;
  milkomedaDecimals: number;
  tokenName: string;
};
export type MilkomedaStargateResponse = {
  current_address: string;
  sidechain_address: string;
  ttl_expiry: number;
  ada: {
    minLovelace: string;
    fromADAFeeLovelace: string;
    toADAFeeGWei: string;
    cardanoDecimals: number;
    milkomedaDecimals: number;
  };
  assets: Array<MilkomedaStargateAsset>;
};
