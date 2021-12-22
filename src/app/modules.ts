import { Application } from 'lisk-sdk';
import { NFTModule } from './modules/nft';

export const registerModules = (app: Application): void => {
	app.registerModule(NFTModule);
};
