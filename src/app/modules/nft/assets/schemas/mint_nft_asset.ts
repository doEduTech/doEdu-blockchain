export interface MintNFTTokenAssetProps {
	readonly name: string;
	readonly ownerAddress: Buffer;
	readonly transferable: boolean;
	readonly meta: Buffer;
	readonly avatarHash: Buffer;
	readonly contentHash: Buffer;
}

export const mintNFTTokenSchema = {
	$id: 'lisk/nft/create',
	type: 'object',
	required: ['name', 'ownerAddress', 'transferable', 'meta', 'avatarHash', 'contentHash'],
	properties: {
		name: {
			dataType: 'string',
			fieldNumber: 1,
		},
		ownerAddress: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
		transferable: {
			dataType: 'boolean',
			fieldNumber: 3,
		},
		meta: {
			dataType: 'bytes',
			fieldNumber: 4,
		},
		avatarHash: {
			dataType: 'bytes',
			fieldNumber: 5,
		},
		contentHash: {
			dataType: 'bytes',
			fieldNumber: 6,
		},
	},
};
