import { BaseModule, GenesisConfig, utils, BaseAsset } from 'lisk-sdk';
import { nftAccountSchema, NFTModuleConfig } from './schemas/nft_account_props';
import { getAllNFTTokensFromStorage, getNFTTokenFromStorage } from './data';

import { MintNFTAsset } from './assets/mint_nft_asset';
import { TransferNFTAsset } from './assets/transfer_nft_asset';

export const nftModuleParamsDefault: NFTModuleConfig = {
	allowedMinters: [],
};

// Extend base module to implement your custom module
export class NFTModule extends BaseModule {
	public name = 'nft';
	public id = 1024;
	public accountSchema = nftAccountSchema;
	public transactionAssets: BaseAsset[];
	public actions = {
		getAllNFTTokens: async () => getAllNFTTokensFromStorage(this._dataAccess),
		getNFTToken: async params =>
			getNFTTokenFromStorage((params as { id: string }).id, this._dataAccess),
	};

	public constructor(config: GenesisConfig) {
		super(config);

		const mergedNFTConfig = utils.objects.mergeDeep(nftModuleParamsDefault, this.config) as {
			allowedMinters: string[];
		};

		if (!mergedNFTConfig.allowedMinters || !Array.isArray(mergedNFTConfig.allowedMinters)) {
			throw new Error('Please provide allowed minters to start NFT module');
		}

		const allowedMinters = mergedNFTConfig.allowedMinters.map(k => Buffer.from(k, 'hex'));

		this.transactionAssets = [new MintNFTAsset(allowedMinters), new TransferNFTAsset()];
	}
}
