import { testing } from 'lisk-sdk';
import { MintNFTAsset } from '../../../../../src/app/modules/nft/assets/mint_nft_asset';
import * as data from '../../../../../src/app/modules/nft/data';
// import { NFTModule } from '../../../../../src/app/modules/nft';

const {
	createTransaction,
	// fixtures,
	mocks,
	createValidateAssetContext,
	createApplyAssetContext,
} = testing;

describe('mint nft asset', () => {
	let asset: any;
	let validTransaction: any;
	let sender: any;
	let recipient: any;
	let stateStore: any;

	beforeEach(() => {
		asset = {
			name: 'nft_name',
			ownerAddress: Buffer.from('111185bf5dcb8c1d3b9bbc98cffb0d0c6077be17', 'hex'),
			transferable: true,
			meta: Buffer.from('meta', 'utf8'),
			avatarHash: Buffer.from('avatarHash', 'utf8'),
			contentHash: Buffer.from('contentHash', 'utf8'),
		};

		validTransaction = createTransaction({
			moduleID: 1024,
			assetClass: MintNFTAsset,
			asset,
			nonce: BigInt(0),
			fee: BigInt('10000000'),
			passphrase: 'wear protect skill sentence lift enter wild sting lottery power floor neglect',
			networkIdentifier: Buffer.from(
				'e48feb88db5b5cf5ad71d93cdcd1d879b6d5ed187a36b0002cc34e0ef9883255',
				'hex',
			),
		});

		// TODO: Use testing.fixtures.createDefaultAccount() when following issue is fixed
		// https://github.com/LiskHQ/lisk-sdk/issues/7055
		sender = {
			address: Buffer.from('8f5685bf5dcb8c1d3b9bbc98cffb0d0c6077be17', 'hex'),
			nft: { ownNFTs: [], mintedNFTs: [] },
		};
		recipient = {
			address: asset.ownerAddress,
			nft: { ownNFTs: [], mintedNFTs: [] },
		};

		stateStore = new mocks.StateStoreMock({ accounts: [recipient, sender] });
	});

	describe('validate asset', () => {
		it('should throw error if the mint transaction is sent from non-allowed address', async () => {
			const mintAsset = new MintNFTAsset(['9f5685bf5dcb8c1d3b9bbc98cffb0d0c6077be17']);
			const context = createValidateAssetContext({ transaction: validTransaction, asset });

			await expect(mintAsset.validate(context)).rejects.toThrow(
				`Not an allowed minter: ${context.transaction.senderAddress.toString('hex')}`,
			);
		});

		it('should pass if transaction is sent from valid address', async () => {
			const context = createValidateAssetContext({ transaction: validTransaction, asset });
			const mintAsset = new MintNFTAsset([context.transaction.senderAddress.toString('hex')]);

			await expect(mintAsset.validate(context)).resolves.toBeUndefined();
		});
	});

	describe('apply asset', () => {
		let mintAsset: any;
		beforeEach(() => {
			mintAsset = new MintNFTAsset(['8f5685bf5dcb8c1d3b9bbc98cffb0d0c6077be17']);
		});

		it('should throw error if nft owner account does not exists', async () => {
			stateStore = new mocks.StateStoreMock({ accounts: [sender] });
			const context = createApplyAssetContext({ transaction: validTransaction, asset, stateStore });

			await expect(mintAsset.apply(context)).rejects.toThrow(
				`Can not mint nft. Owner address: ${recipient.address.toString('hex')} does not exists.`,
			);
		});

		it('should create minted token for recipient', async () => {
			const context = createApplyAssetContext({ transaction: validTransaction, asset, stateStore });
			await mintAsset.apply(context);

			const recipientAccount = await stateStore.account.get(recipient.address);

			expect(recipientAccount.nft.ownNFTs).toHaveLength(1);
		});

		it('should create minted token for sender', async () => {
			const context = createApplyAssetContext({ transaction: validTransaction, asset, stateStore });
			await mintAsset.apply(context);

			const senderAccount = await stateStore.account.get(sender.address);

			expect(senderAccount.nft.mintedNFTs).toHaveLength(1);
		});

		it('should create nft', async () => {
			jest.spyOn(data, 'createNFTToken');
			const context = createApplyAssetContext({ transaction: validTransaction, asset, stateStore });

			await mintAsset.apply(context);

			expect(data.createNFTToken).toHaveBeenCalledWith({
				...context.asset,
				senderAddress: context.transaction.senderAddress,
				nonce: context.transaction.nonce,
			});
		});

		it('should store minted token', async () => {
			const nft = { id: Buffer.from('nft') };
			jest.spyOn(data, 'setAllNFTTokens');
			jest.spyOn(data, 'createNFTToken').mockReturnValue(nft as any);

			const context = createApplyAssetContext({ transaction: validTransaction, asset, stateStore });
			await mintAsset.apply(context);

			expect(data.setAllNFTTokens).toHaveBeenCalledWith(stateStore, [nft]);
		});
	});
});
