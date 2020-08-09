import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  Redirect
} from "react-router-dom";

import CryptoJS from 'crypto-js';
import Dropbox from 'dropbox';

import 'normalize.css';

import {UnControlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/markdown/markdown.js';

import './Home.scss';

import { Config } from './config';

export default function AppRoutes() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/e">
            <Edit />
          </Route>
          <Route path="/d">
            <EditDropbox />
          </Route>
          <Route path="/dropbox">
            <DropboxAuth />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}


/*
 * https://github.com/dropbox/dropbox-sdk-js/blob/master/examples/typescript/auth/auth.js
 */
function parseQueryString(str: string) {
    var ret = Object.create(null);
    if (typeof str !== 'string') {
        return ret;
    }
    str = str.trim().replace(/^(\?|#|&)/, '');
    if (!str) {
        return ret;
    }
    str.split('&').forEach(function (param) {
        var parts = param.replace(/\+/g, ' ').split('=');
        // Firefox (pre 40) decodes `%3D` to `=`
        // https://github.com/sindresorhus/query-string/pull/37
        var key = parts.shift();
        var val = parts.length > 0 ? parts.join('=') : undefined;
        key = decodeURIComponent(key!);
        // missing `=` should be `null`:
        // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
        val = val === undefined ? undefined : decodeURIComponent(val);
        var retVal = ret[key];
        if (ret[key] === undefined) {
            ret[key] = val;
        }
        else if (Array.isArray(retVal)) {
            retVal.push(val);
        }
        else {
            ret[key] = [ret[key], val];
        }
    });
    return ret;
}


const API = "http://localhost:5000";

const fetchFiles = () => {
  return fetch(API + "/list").then(resp => resp.json());
}

const encrypt = (content: string) => {
    console.log(localStorage.getItem("password"));
    return CryptoJS.AES.encrypt(content, localStorage.getItem("password")!).toString();
}
const decrypt = (content: string) =>
    CryptoJS.AES.decrypt(content, localStorage.getItem("password")!)
        .toString(CryptoJS.enc.Utf8);

const createDropbox = () =>
    new Dropbox.Dropbox({accessToken: localStorage.getItem("accessToken")!, fetch: fetch});


const Home = () => {

    const [fileList, setFileList] = useState([]);
    const [authURL, setAuthURL] = useState("");

    const token = localStorage.getItem("accessToken");

    const [dropboxFiles, setDropboxFiles] = useState<any>(undefined);

    const isAuthenticated = () => (token !== undefined && token !== null);

    const useCustomProvider = () => true;
    const useDropboxProvder = () => true;

    useEffect(() => {
        fetchFiles().then(data => setFileList(data));

        if (token === undefined || token === null) {
            let dbx = new Dropbox.Dropbox({ clientId: Config.DBX_CLIENT_ID, fetch: fetch });
            let authURL = dbx.getAuthenticationUrl(Config.DBX_CLIENT_REDIRECT);
            setAuthURL(authURL);
        } else {
            let dbx = new Dropbox.Dropbox({accessToken: token});
            dbx.filesListFolder({ 
                path: '', 
                recursive: false, 
                include_media_info: false,
                include_deleted: false,
                include_has_explicit_shared_members: false,
            }).then((resp) => {
                console.log(resp);
                setDropboxFiles(resp.entries);
            });
        }

    }, [token]);

    const dropboxLogout = () => {
        localStorage.removeItem("accessToken");
        window.location.reload();
    }

    const providerDropbox = () => {
        return (<>
            <p>dropbox entries</p>
            {isAuthenticated() && <p onClick={dropboxLogout}>Click here to log out</p>}
            <ul>
                {dropboxFiles?.map((entry: any) => (
                    <li className="file"><Link to={'/d' + entry.path_lower}>{entry.path_display}</Link></li>
                ))}
            </ul>
        </>);
    }

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
            {(useDropboxProvder() && !isAuthenticated()) ? <a href={authURL}>Authenticate with Dropbox</a> : (<p>Logged into dropbox</p>)}

            {useDropboxProvder() && providerDropbox()}
            {useCustomProvider() && providerCustom()}
        </>
    );
}

function About() {
  return <h2>About</h2>;
}

function DropboxAuth() {
    //let match = useRouteMatch();
    //let params = useParams();

    const [token, setToken] = useState<string | undefined>(undefined);

    useEffect(() => {
        let accessToken = parseQueryString(window.location.hash)['access_token'];
        console.log(accessToken);
        localStorage.setItem("accessToken", accessToken);
        setToken(accessToken);
    }, []);

    return (
        <>
            {(token !== undefined) ? <Redirect to='/'/> : <p>Redirecting...</p>}
        </>
    );
}

function Edit() {
  let match = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${match.path}/:topicId`}>
          <Topic />
        </Route>
        <Route path={match.path}>
          <Redirect to="/" />
        </Route>
      </Switch>
    </div>
  );
}

function EditDropbox() {
    let match = useRouteMatch();

    return (
      <div>
        <Switch>
          <Route path={`${match.path}/:dbxPath`}>
            <DropboxFileEdit />
          </Route>
          <Route path={match.path}>
            <Redirect to="/" />
          </Route>
        </Switch>
      </div>
    );
}

function DropboxFileEdit() {
    let { dbxPath } = useParams();

    const [content, setContent] = useState("");
    const [timer, setTimer] = useState<TimerHandler | any>(null);

    const saveFile = (editor: any, data: any, value: any) => {
        localStorage.setItem(dbxPath, value);
        console.log("creating timer...");

        if (timer !== null) {
            clearTimeout(timer);
        }
        setTimer(setTimeout(() => {
            let encrypted = encrypt(value);
            console.log(encrypted);

            let dbx = createDropbox();
            dbx.filesUpload({ 
                path: '/' + dbxPath ,
                contents: new File(
                    [encrypted], 
                    dbxPath,
                    { type: 'text/plain' }
                ),
                mode: {".tag": "overwrite"},
            })
            .then(resp => console.log(resp))
            .catch(err => console.log(err));
        }, 1000));   
    }

    useEffect(() => {
        let dbx = createDropbox();
        dbx.filesDownload({ path: '/' + dbxPath })
            .then((resp: any) => {
                let f = new FileReader();
                f.onload = () => {
                    let res = f.result;
                    if (typeof res === 'string') {
                        setContent(decrypt(res));
                    }
                }
                f.readAsText(resp.fileBlob);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [dbxPath]);

    return (
        <>
            <p>Yoo dropbox file edit</p>
            {dbxPath}
            <Editor 
                content={content}
                saveFile={(editor, data, value) => 
                    saveFile(editor, data, value)}
            />
        </>
    );
}

function Topic() {
    let { topicId } = useParams();
    const [textContent, setContent] = useState("Loading...");
    const [timer, setTimer] = useState<TimerHandler | any>(null);

    const saveFile = (editor: any, data: any, value: any) => {
        localStorage.setItem(topicId, value);
        console.log("creating timer...");

        if (timer !== null) {
            clearTimeout(timer);
        }
        setTimer(setTimeout(() => {
            let encrypted = CryptoJS.AES.encrypt(value, localStorage.getItem("password")!);
            console.log(encrypted.toString());
            console.log("executing save from timer");
            fetch(API + "/save/" + topicId, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "text",
                },
                redirect: "follow",
                body: encrypted.toString() + "\n",
            }).then(resp => console.log(resp.status))
            .catch(err => console.log(err));
        }, 1000));   
    }

    useEffect(() => {
        let pass = localStorage.getItem("password");
        console.log(pass);
        if (pass === null) {
            let promptedPass = prompt("Please enter the encryption password", '*');
            if (promptedPass !== null) {
                localStorage.setItem("password", promptedPass!);
            }
        }
        fetch(API + "/get/" + topicId)
            .then(resp => resp.text())
            .then(text => {
                let decrypted = CryptoJS.AES.decrypt(text, localStorage.getItem("password")!);
                setContent(decrypted.toString(CryptoJS.enc.Utf8));
            });
    }, [topicId]);

    return (
        <>
            <Link to="/">Back</Link>
            <h3>{topicId}</h3>
            <Editor 
                content={textContent}
                saveFile={(editor, data, value) => 
                    saveFile(editor, data, value)}
            />
        </>
    );
}

interface IEditorProps {
    content: string;
    saveFile: (editor: any, data: any, value: any) => void;
}
const Editor = (props: IEditorProps) => {
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