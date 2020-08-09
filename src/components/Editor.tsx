import React from "react";

import {UnControlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/markdown/markdown.js';


export interface IEditorProps {
	content: string;
	saveFile: (editor: any, data: any, value: any) => void;
}

export const Editor = (props: IEditorProps) => {
	return (
		<CodeMirror 
		value={props.content}
		options={{
			mode: 'markdown',
			theme: 'material',
			lineNumbers: true,
		}}
		onChange={(editor, data, value) => 
			props.saveFile(editor, data, value)}
	/> 
	);
}