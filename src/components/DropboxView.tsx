import React, { 
	useEffect, 
	useState, 
} from "react";

import {
  useHistory,
} from "react-router-dom";

import Dropbox from 'dropbox';
import { DropboxProvider } from '../providers/DropboxProvider';

import { 
  Button,
  MenuList,
  MenuItem,
  FileList,
  FileItem,
  CardContainer,
  CardTitle,
  CardMenu,
  CardContent,
  Input,
  Error,
  Spinner,
} from '../utils/Styles';


export const DropboxView = () => {
  const history = useHistory();
  
  const [dropboxFiles, setDropboxFiles] = useState<any>(undefined);
  const [authURL, setAuthURL] = useState("");

  const [openCreateMenu, setCreateMenu] = useState<boolean>(false);
  const [filename, setCreateFilename] = useState<string>("");

  const [showError, setShowError] = useState<boolean>(false);
  const [error, setError] = useState<string>("Hello am error");
  const [errorTimer, setErrorTimer] = useState<TimerHandler | any>(null);

  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  const dropbox = new DropboxProvider();
  const token = dropbox.getToken();

  useEffect(() => {

		if (!dropbox.isAuthenticated()) {
			setAuthURL(dropbox.getAuthURL());
		} else {
      setShowSpinner(true);
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
        setShowSpinner(false);
			});
    }
    
  // eslint-disable-next-line
  }, [token]);
  

  const doShowError = () => {
    setShowError(true);

    if (errorTimer !== null) {
			clearTimeout(errorTimer);
		}
		setErrorTimer(setTimeout(() => {
      setShowError(false);
		}, 1000 * 10));
  }

  const menu = () => {
    return (
      <>
        <MenuList>
          <MenuItem>
            <Button create onClick={() => setCreateMenu(!openCreateMenu)}>New</Button>
          </MenuItem>
          <MenuItem>
            <Button delete onClick={dropbox.logout}>Logout</Button>
          </MenuItem>
        </MenuList>
      </>
    )
  }

  const createFile = () => {
    if (filename !== "" 
      && filename !== null 
      && dropbox.isAuthenticated()) {
      dropbox.createFile(filename)
        .then(resp => { 
          history.push('/d/' + filename);
        })
        .catch(err => {
          if (err) {
            if (err.error.error) {
              let reason = err.error.error.reason[".tag"];
              setError(`reason: ${reason} - Status code ${err.status}`);
            } else {
              setError(`could not create file - Status code ${err.status}`);
            }
            doShowError();
          }
        });
    }
  }

  const showErrorMenu = () => {
    return (
      <Error>
        <p>{error}</p>
      </Error>
    );
  }

  const newFileMenu = () => {
    return (
      <MenuList>
        <MenuItem>
          <Input 
            type="text"
            placeholder="New filename..."
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => { 
              setCreateFilename(event.target.value);
            }}
            >  
          </Input>
        </MenuItem>
        <MenuItem>
          <Button create onClick={() => createFile()}>Create</Button>
        </MenuItem>
        <MenuItem></MenuItem>
      </MenuList>
    )
  }

  return (
    <>
      <CardContainer>
        <CardTitle>
          <p>Dropbox</p>
        </CardTitle>
        <CardMenu>
          { dropbox.isAuthenticated() && menu() }
          { openCreateMenu && newFileMenu() }
          { showError && showErrorMenu() }
        </CardMenu>
        <CardContent>
          {!dropbox.isAuthenticated()
            && <Button as="a" href={authURL}>Authenticate with Dropbox</Button>}
          { showSpinner && <Spinner></Spinner>}
          <FileList>
            {dropboxFiles?.map((entry: any) => (
              <FileItem as="a" href={'/d' + entry.path_lower}>{entry.path_display}</FileItem>
            ))}
          </FileList>
        </CardContent>
      </CardContainer>
    </>
  );
}