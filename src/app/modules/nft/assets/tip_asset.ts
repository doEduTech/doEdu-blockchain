import { ApplyAssetContext, BaseAsset } from 'lisk-sdk';
import { TipAssetProps, tipAssetSchema } from './schemas/tip_asset';

export const calculateTip = (value: bigint, percentage: bigint) =>
	(value * percentage) / BigInt(100);

export class TipAsset extends BaseAsset<TipAssetProps> {
	public name = 'tip';
	public id = 3;
	public schema = tipAssetSchema;
	public depositAddress: Buffer;
	public feePercentage: bigint;

	public constructor(depositAddress: Buffer, feePercentage: bigint) {
		super();
		this.depositAddress = depositAddress;
		this.feePercentage = feePercentage;
	}

	public async apply({ asset, reducerHandler, transaction }: ApplyAssetContext<TipAssetProps>) {
		const { amount, recipientAddress } = asset;
		const { senderAddress } = transaction;
		const fee = calculateTip(amount, this.feePercentage);
		const transferAmount = amount - fee;

		await reducerHandler.invoke('token:debit', {
			address: senderAddress,
			amount,
		});

		await reducerHandler.invoke('token:credit', {
			address: recipientAddress,
			amount: transferAmount,
		});

		await reducerHandler.invoke('token:credit', {
			address: this.depositAddress,
			amount: fee,
		});
	}
}
