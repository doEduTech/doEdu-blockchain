import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';
import { getAllNFTTokens, setAllNFTTokens, createNFTToken } from '../data';
import { NFTAccountProps } from '../schemas';
import { CreateNFTTokenAsset, createNFTTokenSchema } from './schemas/create_nft_asset';

export class CreateNFTAsset extends BaseAsset<CreateNFTTokenAsset> {
	public name = 'createNFT';
	public id = 0;
	public schema = createNFTTokenSchema;

	public validate({ asset }: ValidateAssetContext<CreateNFTTokenAsset>) {
		if (asset.initValue <= 0) {
			throw new Error('NFT init value is too low.');
		} else if (asset.minPurchaseMargin < 0 || asset.minPurchaseMargin > 100) {
			throw new Error('The NFT minimum purchase value needs to be between 0 and 100.');
		}
	}

	public async apply({
		asset,
		stateStore,
		reducerHandler,
		transaction,
	}: ApplyAssetContext<CreateNFTTokenAsset>) {
		const { senderAddress } = transaction;
		const senderAccount = await stateStore.account.get<NFTAccountProps>(senderAddress);

		const nftToken = createNFTToken({
			name: asset.name,
			ownerAddress: senderAddress,
			nonce: transaction.nonce,
			value: asset.initValue,
			minPurchaseMargin: asset.minPurchaseMargin,
		});

		senderAccount.nft.ownNFTs.push(nftToken.id);
		await stateStore.account.set(senderAddress, senderAccount);

		// 7.debit tokens from sender account to create nft
		await reducerHandler.invoke('token:debit', {
			address: senderAddress,
			amount: asset.initValue,
		});

		const allTokens = await getAllNFTTokens(stateStore);
		allTokens.push(nftToken);
		await setAllNFTTokens(stateStore, allTokens);
	}
}
