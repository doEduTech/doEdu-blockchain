import { BaseModule } from 'lisk-sdk';
import { nftAccountSchema } from './schemas/nft_account_props';
import { getAllNFTTokensAsJSON } from './data';

import { CreateNFTAsset } from './assets/create_nft_asset';
import { TransferNFTAsset } from './assets/transfer_nft_asset';

// Extend base module to implement your custom module
export class NFTModule extends BaseModule {
	public name = 'nft';
	public id = 1024;
	public accountSchema = nftAccountSchema;
	public transactionAssets = [new CreateNFTAsset(), new TransferNFTAsset()];
	public actions = {
		// get all the registered NFT tokens from blockchain
		getAllNFTTokens: async () => getAllNFTTokensAsJSON(this._dataAccess),
	};
}
