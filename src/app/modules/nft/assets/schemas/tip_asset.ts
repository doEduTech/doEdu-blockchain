export interface TipAssetProps {
	readonly amount: bigint;
	readonly data: string;
	readonly recipientAddress: Buffer;
}

export const tipAssetSchema = {
	$id: 'doedu/tip',
	title: 'Tip transaction params',
	type: 'object',
	required: ['amount', 'recipientAddress', 'data'],
	properties: {
		amount: {
			dataType: 'uint64',
			fieldNumber: 1,
		},
		recipientAddress: {
			dataType: 'bytes',
			fieldNumber: 2,
			minLength: 20,
			maxLength: 20,
		},
		data: {
			dataType: 'string',
			fieldNumber: 3,
			minLength: 0,
			maxLength: 64,
		},
	},
};
