import React, { 
	useEffect, 
	useState } 
from "react";
import {
  useParams,
  Link,
} from "react-router-dom";

import { Editor } from '../components/Editor';
import { IProvider, IFile } from "../providers/interfaces";
import {
  EditorContainer,
  EditorHeader,
  EditorFilename,
  EditorLink,
} from '../utils/Styles';


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
   
		}, 1000));   
	}

	useEffect(() => {
		
    props.provider.getFile(filename)
      .then((file: IFile) => setContent(file.content))
      .catch(err => console.log(err));
 
	}, [filename, props.provider]);

	return (
		<>
      <EditorContainer>
        <EditorHeader>
          <EditorLink>
            <Link to="/">&lt; back</Link>
          </EditorLink>
          <EditorFilename>filename: /{filename}</EditorFilename>
        </EditorHeader>
        <Editor 
          content={textContent}
          saveFile={(editor, data, value) => 
            saveFile(editor, data, value)}
        />
      </EditorContainer>
		</>
	);
}
