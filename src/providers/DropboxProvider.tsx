import Dropbox from 'dropbox';
import { Config } from '../config';
import { IFile, IFileMeta, IProvider } from './interfaces';
import { encrypt, decrypt, getPassword } from '../utils/Encryption';

const KEY_ACCESS_TOKEN = "accessToken";

const createDropbox = (token: string) =>
	new Dropbox.Dropbox({
		accessToken: token, 
		fetch: fetch
	});


export class DropboxProvider implements IProvider {

  public getName = (): string => "Dropbox";
	
	public getToken = (): string => 
		localStorage.getItem(KEY_ACCESS_TOKEN)!;

	public setToken = (token: string): void =>
		localStorage.setItem(KEY_ACCESS_TOKEN, token);

	public getAuthURL = (): string => {
		let dbx = new Dropbox.Dropbox({ 
			clientId: Config.DBX_CLIENT_ID, 
			fetch: fetch 
		});
		return dbx.getAuthenticationUrl(Config.DBX_CLIENT_REDIRECT);
	}
	
	public isAuthenticated = (): boolean => 
		(this.getToken() !== undefined && this.getToken() !== null);
	
	public logout = (): void => {
		localStorage.removeItem(KEY_ACCESS_TOKEN);
		window.location.reload();
	}
		
  	public getFiles = (): IFileMeta[] => {
    	return [];
	}

	public createFile = (filename: string): Promise<any> => {
			let encrypted = encrypt("New file!", getPassword());
			console.log(encrypted);

			let dbx = createDropbox(this.getToken());
			return dbx.filesUpload({ 
				path: '/' + filename,
				contents: new File(
					[encrypted], 
					filename,
					{ type: 'text/plain' }
				),
				mode: {".tag": "add"},
			});
	}

	public saveFile = (filename: string, content: string): Promise<boolean> => {
		return new Promise<boolean>((resolve, reject) => {
			let encrypted = encrypt(content, getPassword());
			console.log(encrypted);

			let dbx = createDropbox(this.getToken());
			dbx.filesUpload({ 
				path: '/' + filename,
				contents: new File(
					[encrypted], 
					filename,
					{ type: 'text/plain' }
				),
				mode: {".tag": "overwrite"},
			})
			.then(resp => {
				console.log(resp);
				resolve(true);
			})
			.catch(err => {
				console.log(err);
				reject(err);
			});
		});
	}

	public getFile = (filename: string): Promise<IFile> => {
		return new Promise<IFile>((resolve, reject) => {
			let dbx = createDropbox(this.getToken());
			
			dbx.filesDownload({ path: '/' + filename })
				.then((resp: any) => {
					let f = new FileReader();
					f.onload = () => {
						let res = f.result;
						if (typeof res === 'string') {
							let file: IFile = {
								meta: { 
								filename: filename,
							},
							content: decrypt(res, getPassword()),
							};
							resolve(file);
						}
					}
					f.readAsText(resp.fileBlob);
				})
				.catch((err) => {
					console.log(err);
					reject(err);
				});
			});
	}

	public deleteFile = (filename: string): Promise<any> => {
			let dbx = createDropbox(this.getToken());
			return dbx.filesDelete({ 
				path: '/' + filename,
			});
	}
}


/*

let encrypted = encrypt(value, getPassword());
console.log(encrypted.toString());
console.log("executing save from timer");
fetch(API_URL + "/save/" + filename, {
	method: "POST",
	mode: "cors",
	headers: {
		"Content-Type": "text",
	},
	redirect: "follow",
	body: encrypted.toString() + "\n",
}).then(resp => console.log(resp.status))
.catch(err => console.log(err));
			
fetch(API_URL + "/get/" + filename)
	.then(resp => resp.text())
	.then(text => {
		let decrypted = decrypt(text, getPassword());
		setContent(decrypted);
	});
	*/