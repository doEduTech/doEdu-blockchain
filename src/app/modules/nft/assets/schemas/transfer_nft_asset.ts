export interface TransferNFTTokenAssetProps {
	readonly nftId: Buffer;
	readonly recipient: Buffer;
	readonly name?: string;
}

export const transferNftAssetSchema = {
	$id: 'lisk/nft/transfer',
	type: 'object',
	required: ['nftId', 'recipient'],
	properties: {
		nftId: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		recipient: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
		name: {
			dataType: 'string',
			fieldNumber: 3,
		},
	},
};
