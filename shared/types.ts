export type MilkomedaStargateAsset = {
    idCardano: string; // 0-right-padded fingerprint
    idMilkomeda: string; // ERC20 contract address
    minCNTInt?: string; // min amount of Cardano Native Token
    minGWei?: string; // optional - whatever GWei conversion is
  };
  export type MilkomedaStargateResponse = {
    current_address: string;
    ttl_expiry: number;
    ada: {
      minLovelace: string;
      fromADAFeeLovelace: string;
      toADAFeeGWei: string;
    };
    assets: Array<MilkomedaStargateAsset>;
  };
  