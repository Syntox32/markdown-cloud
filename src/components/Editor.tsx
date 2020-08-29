import React, {
  useState, 
  useEffect,
} from "react";

import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/yonce.css';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/keymap/vim.js';
import { IPlugin } from "../providers/interfaces";

export interface IEditorProps {
	content: string;
  saveFile: (editor: any, data: any, value: string) => void;
  plugins: IPlugin[];
}
export const Editor = (props: IEditorProps) => {

  const [content, setContent] = useState<string>("");

  useEffect(() => {
    props.plugins.forEach((p: IPlugin) => 
      p.initialize(props.content));
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setContent(props.content);
  }, [props.content]);

  const onChangeEvent = (editor: CodeMirror.Editor, data: any, value: any) => {
    props.plugins.forEach((p: IPlugin) => 
      p.onChangeEvent(editor, data, value));

    props.saveFile(editor, data, value);
  }

  const handleBeforeChange = (editor: any, data: any, value: any) => {
    props.plugins.forEach((p: IPlugin) => 
      p.handleBeforeChange(editor, data, value));

    setContent(value);
  }

  const onMount = (editor: CodeMirror.Editor) => {
    editor.setOption("extraKeys", {
      "Alt-A": (cm: CodeMirror.Editor) => {
        let lines = cm.getSelections();
        if (lines.length > 0) {
          lines = lines[0].split("\n");

          for (let i = 0; i < lines.length; i++) {
            console.log(lines[i]);
          }
        }
      }
    });
  }

	return (
    <CodeMirror
      value={content}
      options={{
        mode: 'markdown',
        theme: 'yonce',
        lineNumbers: true,
        lineWrapping: true,
        keyMap: 'default',
      }}
      onBeforeChange={handleBeforeChange}
      onChange={onChangeEvent}
      editorDidMount={onMount}
    />
	);
}