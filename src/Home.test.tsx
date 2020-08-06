import React from 'react';
import { render } from '@testing-library/react';
import AppRoutes from './Home';

test('renders dropbox authenticate link', () => {
  const { getByText } = render(<AppRoutes />);
  const linkElement = getByText(/Authenticate with dropbox/i);
  expect(linkElement).toBeInTheDocument();
});
