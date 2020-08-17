import React, { 
	useEffect, 
	useState } 
from "react";
import {
  useParams,
  useHistory,
} from "react-router-dom";

import { Editor } from '../components/Editor';
import { IProvider, IFile } from "../providers/interfaces";
import {
  EditorContainer,
  EditorHeader,
  EditorFilename,
  MenuList,
  MenuItem,
  Button,
} from '../utils/Styles';


interface IEditorViewProps {
  provider: IProvider;
}
export const EditorView = (props: IEditorViewProps) => {
  const history = useHistory();
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
  
  const deleteFile = () => {
    let name = prompt("Type the filename to confirm you wish to delet it", "");

    if (name != null && name !== "") {
      console.log("deleting file");
      props.provider.deleteFile(filename)
        .then(resp => {
          console.log(resp);
          history.push("/");
        })
      
    }
  }

	useEffect(() => {
		
    props.provider.getFile(filename)
      .then((file: IFile) => setContent(file.content))
      .catch(err => console.log(err));
 
	}, [filename, props.provider]);

	return (
		<>
      <EditorHeader>
        <MenuList>
          <MenuItem>
            <Button onClick={() => history.push("/")}>&lt; back</Button>
          </MenuItem>
          <MenuItem>
            <EditorFilename>filename: /{filename}</EditorFilename>
          </MenuItem>
          <MenuItem>
            <Button onClick={() => deleteFile()}>Delete</Button>
          </MenuItem>
        </MenuList>
      </EditorHeader>
      <EditorContainer>
        <Editor 
          content={textContent}
          saveFile={(editor, data, value) => 
            saveFile(editor, data, value)}
        />
      </EditorContainer>
		</>
	);
}
