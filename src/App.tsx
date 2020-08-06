import React, { useRef, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import 'codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror';

const API = "http://localhost:5000";

const fetchFiles = () => {
  return fetch(API + "/list").then(resp => resp.json())
}

function App() {
  const container = useRef(null);

  const [textContent, setContent] = useState("Loading...");

  var editor = null;

  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchFiles().then(data => setFileList(data));

    editor = CodeMirror.fromTextArea(container.current!, {
      mode: "javascript",
      lineNumbers: true,

    });
  }, []);

  return (
    <div className="App">
      {fileList}
      <textarea ref={container}>{textContent}</textarea>
    </div>
  );
}

export default App;
