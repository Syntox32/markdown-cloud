import React, { 
	useEffect, 
	useState } 
from "react";

import {
  Redirect
} from "react-router-dom";

import { parseQueryString } from '../utils/ParseQueryString';
import { DropboxProvider } from '../providers/DropboxProvider';


export const DropboxRedirectAuth = () => {
	const [token, setToken] = useState<string | undefined>(undefined);

	useEffect(() => {
		let accessToken = parseQueryString(window.location.hash)['access_token'];

		let dropbox = new DropboxProvider();
		dropbox.setToken(accessToken);
		
		setToken(accessToken);
	}, []);

	return (
	<>
		{(token !== undefined) ? <Redirect to='/'/> : <p>Redirecting...</p>}
	</>
	);
}