import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TrackingScores from './TrackingScores';

describe('<TrackingScores />', () => {
  test('it should mount', () => {
    render(<TrackingScores />);
    
    const trackingScores = screen.getByTestId('TrackingScores');

    expect(trackingScores).toBeInTheDocument();
  });
});