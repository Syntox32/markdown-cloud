import styled from 'styled-components';


const backgroundColor = '#0f0b0f';
const fontColor = '#f1f1f1';
const headerColor = "#d57264"; // #b4838d

const containerColor = "#242323";
const menuColor = "#504441"; //"#6c6774";

const colorEditorLink = "#fffbfe";
const btnColor = "#a8bfd7";
const btnColorHover = "#d2edee";
const btnColorActive = "#729bcb";

const btnNewColor = "#80ad3d";
const btnNewHover = "#90bf4a";
const btnNewActive = "#709735";

const btnDeleteColor = "#5f5a67";
const btnDeleteHover = "#746e7c";
const btnDeleteActive = "#4b4851";

const txtFileColor = "#8e9aaf";
const txtFileHover = "#b5becf";

const errorBackground = "#b92e27";
const errorText = "#f7b9b9";

const fontBody = "'Open Sans', sans-serif";
const fontHeader = "'Roboto', sans-serif";
const fontMonospace = "monospace";

export const Backdrop = styled.div`
	background-color: ${backgroundColor};
	height: 100vh;

	font-family: ${fontBody};
	color: ${fontColor};

	@media (max-width: 750px) {

	}
`;

export const Header = styled.h2`
	color: ${headerColor};
	font-family: ${fontHeader};
	font-weight: 400;
	font-size: 42pt;

	@media (max-width: 750px) {
		font-size: 36pt;	
	}
`;

export const Container = styled.div`
	margin: 0 auto;

	@media (max-width: 750px) {
		
	}
`;

export const EditorContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: stretch;

	& .CodeMirror {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		font-size: 12pt;
		padding: 7px 0;
		height: 95vh !important;
	}
`;

export const EditorContent = styled.div`
	@media (max-width: 750px) {
			margin: auto 12px;
	}
`;

export const EditorHeader = styled.div`
	display: flex;
	background-color: ${menuColor};

	@media (max-width: 750px) {
			font-size: 14pt;
	}
`;

export const EditorFilename = styled.h3`
	font-family: ${fontMonospace};
	font-weight: 400;
	padding: 0 10px;
`;

export const EditorLink = styled.div`
	a {
		color: ${colorEditorLink};
		height: 100%;
	}

	a: hover {

	}
`;

interface ButtonProps {
	create?: any;
	delete?: any;
}
export const Button = styled.button<ButtonProps>`
	border: 0;
	outline: none;
	cursor: pointer;
	background-color: ${
		(props) => props.create ? btnNewColor : 
			(props.delete ? btnDeleteColor : 
				btnColor)
	};
	padding: 7px 14px;
	font-weight: bold;
	font-family: ${fontBody};
	color: ${fontColor};

	&:hover {
		background-color: ${
			(props) => props.create ? btnNewHover : 
				(props.delete ? btnDeleteHover : 
					btnColorHover)
		};
	}

	&:active {
		background-color: ${
			(props) => props.create ? btnNewActive : 
				(props.delete ? btnDeleteActive : 
					btnColorActive)
		};
	}
`;

export const Input = styled.input`
	border: 0px;
	text-decoration: none;
	max-width: 700px;
	width: 250px;
	padding: 0 10px;

	&:focus {
		outline: none;
	}
`;

export const MenuList = styled.ul`
	list-style: none;
	display: flex;
	flex-direction: row;
	width: 100%;

	align-items: baseline;

	& > li:last-child {
		margin-left: auto;
	}
`;

export const MenuItem = styled.li`
`;

export const FileList = styled.ul`
	list-style: none;
	display: flex;
	flex-direction: column;
	margin: 7px 0px;
`;

export const FileItem = styled.li`
	font-family: ${fontMonospace};
	color: ${txtFileColor};
	text-decoration: none;
	font-size: 14pt;
	margin: 3px;

	&:hover {
		color: ${txtFileHover};
		
  	&::after {
			content: " <";
		}
	}
`;

export const CardContainer = styled.div`
	width: 100%;
	background-color: ${containerColor};

	max-width: 700px;
	margin: 13px auto;

	@media (max-width: 750px) {
	}
`;

export const CardTitle = styled.div`
	background-color: ${headerColor};
	padding: 10px 20px;
`;

export const CardMenu = styled.div`
	background-color: ${menuColor};
`;

export const CardContent = styled.div`
	padding: 10px 20px;
`;


export const Error = styled.div`
	background-color: ${errorBackground};
	display: flex;
	justify-content: center;

	& > p {
		color: ${errorText};
		padding: 10px;
	}

	& > p:before {
		content: "Error: ";
		font-weight: bold;
	}
`;

export const Spinner = styled.div`
	background-color: ${headerColor};
	width: 100px;
	height: 100px;
	margin: 30px;

	animation-name: spin;
	animation-duration: 1300ms;
	animation-iteration-count: infinite;
	animation-timing-function: ease-in-out; 

	@keyframes spin {
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(180deg);
    }
}
`;