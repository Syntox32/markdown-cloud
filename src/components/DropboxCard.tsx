import React, { 
	useEffect, 
	useState } 
from "react";

import Dropbox from 'dropbox';
import { DropboxProvider } from '../providers/DropboxProvider';


export const DropboxCard = () => {
  const [dropboxFiles, setDropboxFiles] = useState<any>(undefined);
  const [authURL, setAuthURL] = useState("");

  const dropbox = new DropboxProvider();
  const token = dropbox.getToken();
  
  useEffect(() => {

		if (!dropbox.isAuthenticated()) {
			setAuthURL(dropbox.getAuthURL());
		} else {
			let dbx = new Dropbox.Dropbox({accessToken: dropbox.getToken()});
			dbx.filesListFolder({ 
				path: '', 
				recursive: false, 
				include_media_info: false,
				include_deleted: false,
				include_has_explicit_shared_members: false,
			}).then((resp) => {
				console.log(resp);
				setDropboxFiles(resp.entries);
			});
		}

	}, [token]);

  return (
    <>
      <h5>Dropbox</h5>
      {!dropbox.isAuthenticated()
        ? <a href={authURL}>Authenticate with Dropbox</a> 
        : (<p>Logged into dropbox</p>)}
      <ul>
        {dropboxFiles?.map((entry: any) => (
          <li>
              <a href={'/d' + entry.path_lower}>{entry.path_display}</a>
          </li>
        ))}
      </ul>
      {dropbox.isAuthenticated() && 
        (<button onClick={dropbox.logout}>
          Log out
        </button>)}
    </>
  );
}