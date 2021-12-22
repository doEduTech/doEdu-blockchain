export interface CreateNFTTokenAsset {
	readonly minPurchaseMargin: number;
	readonly initValue: bigint;
	readonly name: string;
}

export const createNFTTokenSchema = {
	$id: 'lisk/nft/create',
	type: 'object',
	required: ['minPurchaseMargin', 'initValue', 'name'],
	properties: {
		minPurchaseMargin: {
			dataType: 'uint32',
			fieldNumber: 1,
		},
		initValue: {
			dataType: 'uint64',
			fieldNumber: 2,
		},
		name: {
			dataType: 'string',
			fieldNumber: 3,
		},
	},
};
