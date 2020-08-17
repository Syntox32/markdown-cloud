
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
}