import React, { 
	useState 
} from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

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


import './Home.scss';

import { DropboxCard } from './components/DropboxCard';
import { DropboxRouter } from './components/DropboxRouter';


const theme = createMuiTheme({
	palette: {
		type: 'dark',
	},
});

const useStyles = makeStyles({
	title: {
		fontWeight: 'bold',
	},
	pathName: {
		//color: 'magenta',
		fontFamily: 'monospace',
	},
});


export default function AppRoutes() {

  return (
	<ThemeProvider theme={theme}>
		<CssBaseline/>
		<Router>
			<div>
				<Switch>
				<Route path="/about">
					<About />
				</Route>
				<Route path="/d">
					<DropboxRouter />
				</Route>
				<Route path="/">
					<Home />
				</Route>
				</Switch>
			</div>
		</Router>
	</ThemeProvider>
  );
}

const Home = () => {

	const styles = useStyles();

	const [fileList, setFileList] = useState([]);

	const useCustomProvider = () => true;
	const useDropboxProvder = () => true;

	// 		fetchFiles().then(data => setFileList(data));

	const providerCustom = () => {
		return (<>
		<Grid item spacing={3}>
			<Card elevation={1} variant="outlined">
				<p>server entries</p>
				<ul className="file-list">
					{fileList.map((fileName) => (
						<li className="file"><Link href={'/e/' + fileName}>{fileName}</Link></li>
					))}
				</ul>
			</Card>
		</Grid>
		</>);
	}
	
	return (
		<Container maxWidth="sm">
			<Grid
				container
				direction="column"
				spacing={3}
			>
				<Typography variant="h2" className={styles.title}>markdown.cloud</Typography>
				{useDropboxProvder() && <DropboxCard />}
			</Grid>
		</Container>
	);
}

function About() {
  return <h2>About</h2>;
}
