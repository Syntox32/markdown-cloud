import CryptoJS from 'crypto-js';

export const getPassword = (): string => {
  let pass = localStorage.getItem("password");
		console.log(pass);
		if (pass === null) {
			let promptedPass = prompt("Please enter the encryption password", '*');
			if (promptedPass !== null) {
				localStorage.setItem("password", promptedPass!);
			}
    }
  return localStorage.getItem("password")!;
}

export const encrypt = (content: string, password: string) =>
  CryptoJS.AES.encrypt(content, password)
    .toString();

export const decrypt = (content: string, password: string) =>
	CryptoJS.AES.decrypt(content, password)
		.toString(CryptoJS.enc.Utf8);