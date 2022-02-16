import { BaseAsset, BaseModule, GenesisConfig, utils } from 'lisk-sdk';
import { MintNFTAsset } from './assets/mint_nft_asset';
import { TipAsset, calculateTip } from './assets/tip_asset';
import { TransferNFTAsset } from './assets/transfer_nft_asset';
import { getAllNFTTokensFromStorage, getNFTTokenFromStorage } from './data';
import { nftAccountSchema, NFTModuleConfig } from './schemas/nft_account_props';

export const nftModuleParamsDefault: NFTModuleConfig = {
	allowedMinters: [],
	tipDepositAddress: '',
	tipFeePercentage: 10, // 10 percent
};

// Extend base module to implement your custom module
export class NFTModule extends BaseModule {
	public name = 'nft';
	public id = 1024;
	public accountSchema = nftAccountSchema;
	public transactionAssets: BaseAsset[];
	public actions = {
		getAllNFTs: async () => getAllNFTTokensFromStorage(this._dataAccess),
		getNFT: async params => getNFTTokenFromStorage((params as { id: string }).id, this._dataAccess),
		calculateTip: params => {
			const { amount } = params as { amount: string };
			return calculateTip(BigInt(amount), this._tipFeePercentage);
		},
	};

	private readonly _tipFeePercentage: bigint;

	public constructor(config: GenesisConfig) {
		super(config);

		const mergedNFTConfig = utils.objects.mergeDeep(nftModuleParamsDefault, this.config) as {
			allowedMinters: string[];
			tipDepositAddress: string;
			tipFeePercentage: number;
		};

		if (!mergedNFTConfig.allowedMinters || !Array.isArray(mergedNFTConfig.allowedMinters)) {
			throw new Error('Please provide allowed minters to start NFT module');
		}

		if (!mergedNFTConfig.tipDepositAddress || mergedNFTConfig.tipDepositAddress === '') {
			throw new Error('Please provide deposit address for tip transactions');
		}

		if (!mergedNFTConfig.tipFeePercentage || mergedNFTConfig.tipFeePercentage <= 0) {
			throw new Error('Please provide tip fee percentage');
		}

		const tipDepositAddress = Buffer.from(mergedNFTConfig.tipDepositAddress, 'hex');
		this._tipFeePercentage = BigInt(mergedNFTConfig.tipFeePercentage);

		this.transactionAssets = [
			new MintNFTAsset(mergedNFTConfig.allowedMinters),
			new TransferNFTAsset(),
			new TipAsset(tipDepositAddress, this._tipFeePercentage),
		];
	}
}
