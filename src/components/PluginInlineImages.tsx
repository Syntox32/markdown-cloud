import { v4 as uuidv4 } from 'uuid';
import { IPlugin } from "../providers/interfaces";


interface ImageData {
    url: string;
    line: number;
    width: string;
    widget?: CodeMirror.LineWidget;
}

interface ImageDict {
    [key:string]: ImageData;
}

export class InlineImagesPlugin implements IPlugin {

    private widgetMap: ImageDict = {};

    public getPluginName = () => "Inline Images";

    public initialize = (value: string) => {
        this.buildImageDict(value);
    };

    constructor() {
        console.log("i was made");
    }

    public onChangeEvent = (editor: CodeMirror.Editor, data: CodeMirror.EditorChange, value: string) => {
        this.widgetMap = this.buildImageDict(value);
        this.addWidgetsToEditor(editor);
    };

    public handleBeforeChange = (editor: CodeMirror.Editor, data: CodeMirror.EditorChange, value: string) => {
        this.clearWidgets();
        //this.addWidgetsToEditor(editor);
    };

    private clearWidgets = () => {
        Object.keys(this.widgetMap).forEach((key: string) => {
            if (this.widgetMap[key].widget !== undefined) {
                this.widgetMap[key].widget!.clear();
                this.widgetMap[key].widget = undefined;
            }
        });
    }

    private buildImageDict = (value: string): ImageDict  => {
        let store: ImageDict = {};
        let imageRegexp = /!\[(.*?)\]\((.*?)\)(\(\d+(px)?\))?/;
        let lines = value.split(/\r\n|\r|\n/);

        lines.forEach((value: string, i: number) => {
            let m = imageRegexp.exec(value);
            if (m) {
                let url = m[2];
                console.log(url);

                let width = "100%";
                if (m[3] !== undefined) {
                    width = m[3].replace("(", "").replace(")", "");
                }
            
                let key = uuidv4();
                store[key] = {
                    url: url,
                    line: i,
                    width: width,
                };
            }
        });

        return store;
    }

    private addWidgetsToEditor = (editor: CodeMirror.Editor) => {
        let doc: CodeMirror.Doc = editor.getDoc();

        Object.keys(this.widgetMap).forEach((key: string) => {
            let widget = this.widgetMap[key].widget;
    
            if (widget === undefined) {
                let img = document.createElement("img");
                img.setAttribute("src", this.widgetMap[key].url);
                img.setAttribute("style", `width: ${this.widgetMap[key].width}`);
        
                let newWidget: CodeMirror.LineWidget = doc.addLineWidget(this.widgetMap[key].line, img);
                this.widgetMap[key].widget = newWidget;
            }
        });
    }

}