import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App.js';

describe('App', () => {
  it('mostra il nome del prodotto e la data in italiano', () => {
    render(<App oggi={new Date('2026-11-10T21:30:00Z')} />);
    expect(screen.getByRole('heading', { name: 'Ordinachatbot' })).toBeTruthy();
    expect(screen.getByText(/martedì 10 novembre 2026/)).toBeTruthy();
  });
});
