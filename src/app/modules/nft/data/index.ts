import { codec, cryptography, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { RegisteredNFTs, NFT, RegisteredNFTsJson, registeredNFTTokensSchema } from '../schemas';


export const CHAIN_STATE_NFT_TOKENS = 'nft:registeredNFTTokens';

export const createNFTToken = ({
	name,
	ownerAddress,
	nonce,
	value,
	minPurchaseMargin,
}: Omit<NFT, 'id'> & { nonce: bigint }) => {
	const nonceBuffer = Buffer.alloc(8);
	nonceBuffer.writeBigInt64LE(nonce);
	const seed = Buffer.concat([ownerAddress, nonceBuffer]);
	const id = cryptography.hash(seed);

	return {
		id,
		minPurchaseMargin,
		name,
		ownerAddress,
		value,
	};
};

export const getAllNFTTokens = async (stateStore: StateStore) => {
	const registeredTokensBuffer = await stateStore.chain.get(CHAIN_STATE_NFT_TOKENS);
	if (!registeredTokensBuffer) {
		return [];
	}

	const registeredTokens = codec.decode<RegisteredNFTs>(
		registeredNFTTokensSchema,
		registeredTokensBuffer,
	);

	return registeredTokens.registeredNFTTokens;
};

export const getAllNFTTokensAsJSON = async (dataAccess: BaseModuleDataAccess) => {
	const registeredTokensBuffer = await dataAccess.getChainState(CHAIN_STATE_NFT_TOKENS);

	if (!registeredTokensBuffer) {
		return [];
	}

	const registeredTokens = codec.decode<RegisteredNFTs>(
		registeredNFTTokensSchema,
		registeredTokensBuffer,
	);

	return codec.toJSON<RegisteredNFTsJson>(registeredNFTTokensSchema, registeredTokens)
		.registeredNFTTokens;
};

export const setAllNFTTokens = async (stateStore: StateStore, NFTTokens: NFT[]) => {
	const registeredTokens = {
		registeredNFTTokens: NFTTokens.sort((a, b) => a.id.compare(b.id)),
	};

	await stateStore.chain.set(
		CHAIN_STATE_NFT_TOKENS,
		codec.encode(registeredNFTTokensSchema, registeredTokens),
	);
};
