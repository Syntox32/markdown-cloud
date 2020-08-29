
export interface IFileMeta {
  filename: string;
}

export interface IFile {
  meta: IFileMeta;
  content: string;
}

export interface IProvider {
  getName: () => string;
  isAuthenticated: () => boolean;
  getFiles: () => IFileMeta[];
  getFile: (filename: string) => Promise<IFile>;
  saveFile: (filename: string, content: string) => Promise<boolean>;
  createFile: (filename: string) => Promise<any>;
  deleteFile: (filename: string) => Promise<any>;
}

export interface IPlugin {
  getPluginName: () => string;
  initialize: (value: string) => void;
  onChangeEvent: (editor: CodeMirror.Editor, data: CodeMirror.EditorChange, value: string) => void;
  handleBeforeChange: (editor: CodeMirror.Editor, data: CodeMirror.EditorChange, value: string) => void;
}
