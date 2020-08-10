import styled from 'styled-components';


const backgroundColor = '#0f0b0f';
const fontColor = '#f1f1f1';
const headerColor = '#dfb4ca';

const fontBody = "'Open Sans', sans-serif";
const fontHeader = "'Roboto', sans-serif";


export const Backdrop = styled.div`
	background-color: ${backgroundColor};
	height: 100vh;

	font-family: ${fontBody};
	color: ${fontColor};
`;

export const Header = styled.h2`
	color: ${headerColor};
	font-family: ${fontHeader};
	font-weight: 400;
	font-size: 42pt;
`;

export const Container = styled.div`
	margin: 0 auto;
	width: 600px;
`;

export const EditorContainer = styled.div`

`;

export const EditorHeader = styled.div`
	display: flex;
	align-items: baseline;
	background-color: #ba5454;
		
	& > * {
		margin: 10px;
	}

	& > a {
		
	}
`;

export const EditorFilename = styled.h3`
	font-family: monospace;
	font-weight: 400;
`;

export const EditorLink = styled.div`
	a {
		color: #fffbfe;
		height: 100%;
	}

	a: hover {

	}
`;