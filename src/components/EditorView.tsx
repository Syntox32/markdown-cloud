import React, { 
	useEffect, 
	useState } 
from "react";

import {
  useParams,
} from "react-router-dom";

import { Editor } from '../components/Editor';
import { API_URL } from '../utils/CustomAPI';
import {
	encrypt,
	decrypt,
	getPassword
} from '../utils/Encryption';

import { 
	createMuiTheme, 
	ThemeProvider, 
	makeStyles, 
	createStyles 
} from '@material-ui/core/styles';

import {
	Link,
} from '@material-ui/core';

import { IProvider, IFile, IFileMeta } from "../providers/interfaces";

interface IEditorViewProps {
  provider: IProvider;
}
export const EditorView = (props: IEditorViewProps) => {
  let { filename } = useParams();
  
	const [textContent, setContent] = useState("Loading...");
	const [timer, setTimer] = useState<TimerHandler | any>(null);

	const saveFile = (editor: any, data: any, value: any) => {
		localStorage.setItem(filename, value);
		console.log("creating timer...");

		if (timer !== null) {
			clearTimeout(timer);
		}
		setTimer(setTimeout(() => {
      props.provider.saveFile(filename, value)
        .then(success => console.log(success))
        .catch(err => console.log(err));
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
      */
		}, 1000));   
	}

	useEffect(() => {
		
    props.provider.getFile(filename)
      .then((file: IFile) => setContent(file.content))
      .catch(err => console.log(err));
    /*
		fetch(API_URL + "/get/" + filename)
			.then(resp => resp.text())
			.then(text => {
				let decrypted = decrypt(text, getPassword());
				setContent(decrypted);
      });
      */
	}, [filename]);

	return (
		<>
			<Link href="/">Back</Link>
			<h3>{filename}</h3>
			<Editor 
				content={textContent}
				saveFile={(editor, data, value) => 
					saveFile(editor, data, value)}
			/>
		</>
	);
}
