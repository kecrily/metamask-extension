import { fireEvent, queryByRole, screen } from '@testing-library/react';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import mockState from '../../../../test/data/mock-state.json';
import { renderWithProvider } from '../../../../test/lib/render-helpers';
import SecurityTab from './security-tab.container';

describe('Security Tab', () => {
  const mockStore = configureMockStore([thunk])(mockState);

  function testToggleCheckbox(testId, initialState) {
    renderWithProvider(<SecurityTab />, mockStore);

    const container = screen.getByTestId(testId);
    const checkbox = queryByRole(container, 'checkbox');

    expect(checkbox).toHaveAttribute('value', initialState ? 'true' : 'false');

    fireEvent.click(checkbox); // This fires the onToggle method of the ToggleButton, but it doesn't change the value of the checkbox

    fireEvent.change(checkbox, {
      target: { value: !initialState }, // This changes the value of the checkbox
    });

    expect(checkbox).toHaveAttribute('value', initialState ? 'false' : 'true');
  }

  it('should match snapshot', () => {
    const { container } = renderWithProvider(<SecurityTab />, mockStore);

    expect(container).toMatchSnapshot();
  });

  it('toggles phishing detection', () => {
    testToggleCheckbox('usePhishingDetection', true);
  });

  it('toggles balance and token price checker', () => {
    testToggleCheckbox('currencyRateCheckToggle', true);
  });

  it('toggles incoming txs', () => {
    testToggleCheckbox('showIncomingTransactions', true);
  });

  it('should toggle token detection', () => {
    testToggleCheckbox('autoDetectTokens', true);
  });

  it('toggles batch balance checks', () => {
    testToggleCheckbox('useMultiAccountBalanceChecker', false);
  });

  it('toggles metaMetrics', () => {
    testToggleCheckbox('participateInMetaMetrics', false);
  });

  it('toggles SRP Quiz', async () => {
    renderWithProvider(<SecurityTab />, mockStore);

    expect(
      screen.queryByTestId(`srp_stage_introduction`),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('reveal-seed-words'));

    expect(screen.getByTestId(`srp_stage_introduction`)).toBeInTheDocument();

    const container = screen.getByTestId('srp-quiz-header');
    const checkbox = queryByRole(container, 'button');
    fireEvent.click(checkbox);

    expect(
      screen.queryByTestId(`srp_stage_introduction`),
    ).not.toBeInTheDocument();
  });
});
