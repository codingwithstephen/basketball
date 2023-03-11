import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ResultsSnapshot from './ResultsSnapshot';

describe('<ResultsSnapshot />', () => {
  test('it should mount', () => {
    render(<ResultsSnapshot />);
    
    const teamResults = screen.getByTestId('ResultsSnapshot');

    expect(teamResults).toBeInTheDocument();
  });
});