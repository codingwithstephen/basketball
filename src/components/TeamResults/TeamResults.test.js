import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TeamResults from './TeamResults';

describe('<TeamResults />', () => {
  test('it should mount', () => {
    render(<TeamResults />);
    
    const teamResults = screen.getByTestId('TeamResults');

    expect(teamResults).toBeInTheDocument();
  });
});