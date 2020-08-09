import React, { 
	useState 
} from "react";

import {
  BrowserRouter as Router,
  Switch,
	Route,
	Link,
} from "react-router-dom";

import './Home.scss';

import { DropboxCard } from './components/DropboxCard';
import { DropboxRouter } from './components/DropboxRouter';


export default function AppRoutes() {

  return (
		<Router>
			<div>
				<Switch>
					<Route path="/d">
						<DropboxRouter />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</div>
		</Router>
  );
}

const Home = () => {
	const [fileList, setFileList] = useState([]);

	const useCustomProvider = () => true;
	const useDropboxProvder = () => true;

	// 		fetchFiles().then(data => setFileList(data));

	const providerCustom = () => {
		return (<>
				<p>server entries</p>
				<ul className="file-list">
					{fileList.map((fileName) => (
						<li className="file"><Link to={'/e/' + fileName}>{fileName}</Link></li>
					))}
				</ul>
		</>);
	}
	
	return (
		<>
			<h2>markdown.cloud</h2>
			{useDropboxProvder() && <DropboxCard />}
		</>
	);
}