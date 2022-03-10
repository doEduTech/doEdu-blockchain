import { BaseModuleDataAccess, codec, cryptography, StateStore } from 'lisk-sdk';
import { NFT, RegisteredNFTs, RegisteredNFTsJson, registeredNFTTokensSchema } from '../schemas';


export const CHAIN_STATE_NFT_TOKENS = 'nft:registeredNFTTokens';
export const CHAIN_STATE_NFT_TX_INDEX  = 'nft:tx';

export const createNFTToken = (data: Omit<NFT, 'id'> & { nonce: bigint; senderAddress: Buffer }) => {
	const nonceBuffer = Buffer.alloc(8);
	nonceBuffer.writeBigInt64LE(data.nonce);
	const seed = Buffer.concat([data.senderAddress, data.ownerAddress, nonceBuffer]);
	const id = cryptography.hash(seed);

	return {
		...data,
		id,
	};
};

export const getAllNFTTokens = async (stateStore: StateStore) => {
	const registeredTokensBuffer = await stateStore.chain.get(CHAIN_STATE_NFT_TOKENS);

	if (!registeredTokensBuffer) {
		return [];
	}

	return (codec.decode<RegisteredNFTs>(
		registeredNFTTokensSchema,
		registeredTokensBuffer
	)).registeredNFTTokens;
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


export const getAllNFTTokensFromStorage = async (dataAccess: BaseModuleDataAccess) => {
	const registeredTokensBuffer = await dataAccess.getChainState(CHAIN_STATE_NFT_TOKENS);

	return codec.decodeJSON<RegisteredNFTsJson>(registeredNFTTokensSchema, registeredTokensBuffer)
		.registeredNFTTokens
};

export const getNFTTokenFromStorage = async (id: string, dataAccess: BaseModuleDataAccess) => {
	const tokens = await getAllNFTTokensFromStorage(dataAccess);

	if(tokens.length === 0) {
		return undefined;
	}

	return tokens.find(t => t.id === id);
}

export const setTxIndexForNFT = async (txId: Buffer, nftId: Buffer, stateStore: StateStore) => stateStore.chain.set(`${CHAIN_STATE_NFT_TX_INDEX}:${txId.toString('hex')}`, nftId)

export const getNFTByTxIdFromStorage = async (id: string, dataAccess: BaseModuleDataAccess) => {
	const nftId = await dataAccess.getChainState(`${CHAIN_STATE_NFT_TX_INDEX}:${id}`);

	if(!nftId) {
		throw new Error(`Can not find NFT for tx id: ${id}`);
	}

	return getNFTTokenFromStorage(nftId.toString('hex'), dataAccess);
}

