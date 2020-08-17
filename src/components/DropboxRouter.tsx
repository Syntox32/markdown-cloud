import React from "react";

import {
  Switch,
  Route,
  useRouteMatch,
  Redirect
} from "react-router-dom";

import { EditorView } from './EditorView';
import { DropboxProvider } from '../providers/DropboxProvider';
import { DropboxRedirectAuth } from '../components/DropboxAuthRedirect';

export const DropboxRouter = () => {
	let match = useRouteMatch();

	return (
	  <div>
      <Switch>
        <Route path={`${match.path}/auth`}>
          <DropboxRedirectAuth />
        </Route>
        <Route path={`${match.path}/:filename`}>
          <EditorView provider={new DropboxProvider()} />
        </Route>
        <Route path={match.path}>
          <Redirect to="/" />
        </Route>
      </Switch>
	  </div>
	);
}