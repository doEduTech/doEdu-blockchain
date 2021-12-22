import { ApplyAssetContext, BaseAsset } from 'lisk-sdk';
import { getAllNFTTokens, setAllNFTTokens } from '../data';
import { NFTAccountProps } from '../schemas';
import { TransferNFTTokenAssetProps, transferNftAssetSchema } from './schemas/transfer_nft_asset';

export class TransferNFTAsset extends BaseAsset<TransferNFTTokenAssetProps> {
	public name = 'transferNFT';
	public id = 1;
	public schema = transferNftAssetSchema;

	public async apply({
		asset,
		stateStore,
		transaction,
	}: ApplyAssetContext<TransferNFTTokenAssetProps>) {
		const nftTokens = await getAllNFTTokens(stateStore);
		const nftTokenIndex = nftTokens.findIndex(t => t.id.equals(asset.nftId));

		if (nftTokenIndex < 0) {
			throw new Error('Token id not found');
		}
		const token = nftTokens[nftTokenIndex];

		if (!token.transferable) {
			throw new Error('It is a non-transferable NFT');
		}

		const tokenOwnerAddress = token.ownerAddress;
		const { senderAddress } = transaction;

		if (!tokenOwnerAddress.equals(senderAddress)) {
			throw new Error('An NFT can only be transferred by the owner of the NFT.');
		}

		const tokenOwner = await stateStore.account.get<NFTAccountProps>(tokenOwnerAddress);
		const ownerTokenIndex = tokenOwner.nft.ownNFTs.findIndex(a => a.equals(token.id));
		tokenOwner.nft.ownNFTs.splice(ownerTokenIndex, 1);
		await stateStore.account.set(tokenOwnerAddress, tokenOwner);

		const recipientAddress = asset.recipient;
		const recipientAccount = await stateStore.account.get<NFTAccountProps>(recipientAddress);
		recipientAccount.nft.ownNFTs.push(token.id);
		await stateStore.account.set(recipientAddress, recipientAccount);

		const updatedToken = {
			...token,
			ownerAddress: recipientAddress,
		};

		nftTokens[nftTokenIndex] = updatedToken;
		await setAllNFTTokens(stateStore, nftTokens);
	}
}
