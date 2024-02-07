import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App tl={true}/>);
  const linkElement = screen.queryAllByText(/iPLAYER/);
  expect(linkElement).toEqual([]);
});
