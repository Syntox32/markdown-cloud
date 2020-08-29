import React, { useEffect } from "react";

import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";

import './Home.scss';

import { DropboxView } from './components/DropboxView';
import { DropboxRouter } from './components/DropboxRouter';

import {
	Backdrop, 
	Container, 
	EditorContainer,
	EditorHeader,
	EditorContent,
} from './utils/Styles';


export default function AppRoutes() {

  return (
	<Backdrop>
		<Container>
			<Router>
				<Switch>
					<Route path="/d">
						<DropboxRouter />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</Router>
		</Container>
	</Backdrop>
  );
}

const Home = () => {

	const useDropboxProvder = () => true;

	// 		fetchFiles().then(data => setFileList(data));

	/*const providerCustom = () => {
		return (<>
				<p>server entries</p>
				<ul className="file-list">
					{fileList.map((fileName) => (
						<li className="file"><Link to={'/e/' + fileName}>{fileName}</Link></li>
					))}
				</ul>
		</>);
	}*/

	useEffect(() => {
		// reset title when going 'back'
		document.title = "markdown.cloud";
	}, []);
	
	return (
		<>
			<EditorContainer>
				<EditorHeader>
					<p>markdown.cloud</p>
				</EditorHeader>
				<EditorContent>
					{useDropboxProvder() && <DropboxView />}
				</EditorContent>
			</EditorContainer>
		</>
	);
}

/*
<EditorHeader>/markdown.cloud</EditorHeader>
			
*/ 