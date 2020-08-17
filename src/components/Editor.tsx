import React, {
  useState, 
  useEffect,
} from "react";

import sha256 from 'crypto-js/sha256';
import { v4 as uuidv4 } from 'uuid';

import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/yonce.css';
import 'codemirror/mode/markdown/markdown.js';


interface ImageData {
  url: string;
  line: number;
  uuid: string;
  width: string;
  widget?: CodeMirror.LineWidget;
}

interface ImageDict {
  [key:string]: ImageData;
}

export interface IEditorProps {
	content: string;
	saveFile: (editor: any, data: any, value: any) => void;
}

export const Editor = (props: IEditorProps) => {

  // eslint-disable-next-line
  const [loading, setLoading] = useState<boolean>(true);
  const [widgetMap, setWidgetMap] = useState<ImageDict>({});
  const [editorr, setEditor] = useState<CodeMirror.Editor | undefined>(undefined);

  const [content, setContent] = useState<string>("");

  useEffect(() => {
    setContent(props.content);
  }, [props.content]);

  const onChangeEvent = (editor: CodeMirror.Editor, data: any, value: any) => {

    if (editorr === undefined) {
      setEditor(editor);
    }

    let lines = value.split(/\r\n|\r|\n/);
    let imageRegexp = /!\[(.*?)\]\((.*?)\)(\(\d+(px)?\))?/; ///!\[(.*?)\]\((.*)\)/;

    let store: ImageDict = {};
    lines.forEach((value: string, i: number) => {
      let m = imageRegexp.exec(value);
      if (m) {
        let url = m[2];
        console.log(url);

        let width = "100%";
        if (m[3] !== undefined) {
          width = m[3].replace("(", "").replace(")", "");
        }
        let key = i.toString() + "-" + sha256(url).toString();
        if (key in Object.keys(widgetMap)) {
          console.log("in map");
        } else {
          console.log("not in map");
          console.log(i);

          store[key] = {
            url: url,
            line: i,
            width: width,
            uuid: uuidv4(),
          };
        }    
      }
    });

    setWidgetMap(store);
    props.saveFile(editor, data, value);
  }

  const handleBeforeChange = (editor: any, data: any, value: any) => {
    Object.keys(widgetMap).forEach((key: string) => {
      widgetMap[key].widget?.clear();
    });

    setContent(value);
  }

  useEffect(() => {
    setLoading(false);
  }, [props.content]);

  useEffect(() => {

    console.log(widgetMap);

    if (editorr !== undefined) {
      let doc: CodeMirror.Doc = editorr.getDoc();
      Object.keys(widgetMap).forEach((key: string) => {
        let id = sha256(key).toString();
        let widget = widgetMap[key].widget;

        if (widget === undefined) {
          let img = document.createElement("img");
          img.setAttribute("src", widgetMap[key].url);
          img.setAttribute("id", id);
          img.setAttribute("style", `width: ${widgetMap[key].width}`);
          img.setAttribute("class", "inline-image-widget");

          let newWidget: CodeMirror.LineWidget = doc.addLineWidget(widgetMap[key].line, img);

          let store = widgetMap;
          store[key].widget = newWidget;
          setWidgetMap(store);
        }
      });
    }
  // eslint-disable-next-line
  }, [widgetMap]);

	return (
    <CodeMirror
      value={content}
      options={{
        mode: 'markdown',
        theme: 'yonce',
        lineNumbers: true,
        lineWrapping: true,
      }}
      onBeforeChange={handleBeforeChange}
      onChange={onChangeEvent}
    />
	);
}