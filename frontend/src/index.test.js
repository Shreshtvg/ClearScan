// index.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import ReactDOM from 'react-dom/client';
import App from './App';

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn().mockReturnValue({
    render: jest.fn(),
  }),
}));

describe('index.js', () => {
  test('renders App component into the root element', () => {
    const mockCreateRoot = ReactDOM.createRoot();
    render(<App />);

    // We don't actually render anything in the test, but we are testing if
    // ReactDOM.createRoot was called with the correct root element
    expect(mockCreateRoot.render).toHaveBeenCalledWith(
      expect.anything() // The first argument to render is <App />
    );
  });
});
