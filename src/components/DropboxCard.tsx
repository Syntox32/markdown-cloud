import React, { 
	useEffect, 
	useState } 
from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  useParams,
  Redirect
} from "react-router-dom";

import Dropbox from 'dropbox';


import { DropboxProvider } from '../providers/DropboxProvider';

import { Editor } from '../components/Editor';
import { EditorView } from '../components/EditorView';

import { 
	createMuiTheme, 
	ThemeProvider, 
	makeStyles, 
	createStyles 
} from '@material-ui/core/styles';
import {
	CssBaseline,
	Button,
	Grid,
	Card,
	Container,
	Typography,
	Paper,
	CardContent,
	ListItem,
	List,
	Link,
	CardActionArea,
	CardActions,
} from '@material-ui/core';


const useStyles = makeStyles({
	title: {
		fontWeight: 'bold',
	},
	pathName: {
		//color: 'magenta',
		fontFamily: 'monospace',
	},
});


export const DropboxCard = () => {
  const styles = useStyles();

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

  return (<>
    <Grid item spacing={3}>
      <Card elevation={1} variant="outlined">
        <CardContent>
          <Typography gutterBottom variant="h5" component="h1" color="secondary">
            Dropbox
          </Typography>
          {!dropbox.isAuthenticated()
            ? <Link href={authURL}>Authenticate with Dropbox</Link> 
            : (<Typography variant="body2">Logged into dropbox</Typography>)}
          <List dense={true}>
            {dropboxFiles?.map((entry: any) => (
              <ListItem className="file">
                <Typography>
                  <Link
                    className={styles.pathName}
                    href={'/d' + entry.path_lower}
                    color="inherit"
                  >
                    {entry.path_display}
                  </Link>
                </Typography>
              </ListItem>
            ))}
          </List>
        </CardContent>
        <CardActions>
          {dropbox.isAuthenticated() && 
            (<Button size="small" color="secondary" onClick={dropbox.logout}>
              Log out
            </Button>)}
        </CardActions>
      </Card>
    </Grid>
  </>);
}