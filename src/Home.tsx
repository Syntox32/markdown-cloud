import React, { 
	 
} from "react";

import {
  BrowserRouter as Router,
  Switch,
	Route,
} from "react-router-dom";

import './Home.scss';

import { DropboxCard } from './components/DropboxCard';
import { DropboxRouter } from './components/DropboxRouter';

import {
	Backdrop, 
	Container, 
	EditorContainer,
  EditorHeader,
  EditorFilename,
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
	
	return (
		<>
			<EditorContainer>
        <EditorHeader>
          <EditorFilename>markdown.cloud</EditorFilename>
        </EditorHeader>
				{useDropboxProvder() && <DropboxCard />}
      </EditorContainer>
		</>
	);
}

/*
<EditorHeader>/markdown.cloud</EditorHeader>
			
*/ 