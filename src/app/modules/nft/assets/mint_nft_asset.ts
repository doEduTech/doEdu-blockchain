import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';
import { getAllNFTTokens, setAllNFTTokens, createNFTToken } from '../data';
import { NFTAccountProps } from '../schemas';
import { MintNFTTokenAssetProps, mintNFTTokenSchema } from './schemas/mint_nft_asset';

export class MintNFTAsset extends BaseAsset<MintNFTTokenAssetProps> {
	public name = 'mintNFT';
	public id = 0;
	public schema = mintNFTTokenSchema;
	public allowedMinters: ReadonlyArray<string>;

	public constructor(allowedMinters: ReadonlyArray<string>) {
		super();
		this.allowedMinters = allowedMinters;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async validate({ transaction }: ValidateAssetContext<MintNFTTokenAssetProps>) {
		if (!this.allowedMinters.includes(transaction.senderAddress.toString('hex'))) {
			throw new Error(`Not an allowed minter: ${transaction.senderAddress.toString('hex')}`);
		}
	}

	public async apply({
		asset,
		stateStore,
		transaction,
	}: ApplyAssetContext<MintNFTTokenAssetProps>) {
		const { senderAddress } = transaction;
		const senderAccount = await stateStore.account.get<NFTAccountProps>(transaction.senderAddress);
		let ownerAccount: Unwrap<ReturnType<typeof stateStore.account.get>> & NFTAccountProps;

		try {
			ownerAccount = await stateStore.account.get<NFTAccountProps>(asset.ownerAddress);
		} catch {
			throw new Error(
				`Can not mint nft. Owner address: ${asset.ownerAddress.toString('hex')} does not exists.`,
			);
		}

		const nftToken = createNFTToken({
			...asset,
			senderAddress,
			nonce: transaction.nonce,
		});

		ownerAccount.nft.ownNFTs.push(nftToken.id);
		await stateStore.account.set(asset.ownerAddress, ownerAccount);

		senderAccount.nft.mintedNFTs.push(nftToken.id);
		await stateStore.account.set(transaction.senderAddress, senderAccount);

		const allTokens = await getAllNFTTokens(stateStore);
		allTokens.push(nftToken);
		await setAllNFTTokens(stateStore, allTokens);
	}
}
