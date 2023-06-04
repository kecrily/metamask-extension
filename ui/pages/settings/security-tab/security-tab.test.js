import {
  fireEvent,
  queryByRole,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import mockState from '../../../../test/data/mock-state.json';
import { renderWithProvider, t } from '../../../../test/lib/render-helpers';
import SecurityTab from './security-tab.container';

describe('Security Tab', () => {
  delete mockState.metamask.featureFlags; // Unset featureFlags in order to test the default value
  mockState.appState.warning = 'warning'; // This tests an otherwise untested render branch

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

  // async function testToggleCheckbox(testId, initialState) {
  //   const user = userEvent.setup();
  //   renderWithProvider(<SecurityTab />, mockStore);

  //   const container = screen.getByTestId(testId);
  //   const checkbox = queryByRole(container, 'checkbox');

  //   expect(checkbox).toHaveAttribute('value', initialState ? 'true' : 'false');

  //   // await user.click(checkbox); // This fires the onToggle method of the ToggleButton, but it doesn't change the value of the checkbox
  //   fireEvent.click(checkbox); // This fires the onToggle method of the ToggleButton, but it doesn't change the value of the checkbox

  //   // const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  //   // await setTimeout(100000);

  //   // fireEvent.change(checkbox, {
  //   //   target: { value: !initialState }, // This changes the value of the checkbox
  //   // });

  //   await waitFor(
  //     () => {
  //       expect(checkbox).toHaveAttribute(
  //         'value',
  //         initialState ? 'false' : 'true',
  //       );
  //     },
  //     { timeout: 100000 },
  //   );

  //   // expect(checkbox).toHaveAttribute('value', initialState ? 'false' : 'true');
  // }

  it('should match snapshot', () => {
    const { container } = renderWithProvider(<SecurityTab />, mockStore);

    expect(container).toMatchSnapshot();
  });

  it('toggles phishing detection', async () => {
    await testToggleCheckbox('usePhishingDetection', true);
  });

  it('toggles balance and token price checker', async () => {
    await testToggleCheckbox('currencyRateCheckToggle', true);
  });

  it('toggles incoming txs', async () => {
    await testToggleCheckbox('showIncomingTransactions', false);
  });

  it('should toggle token detection', async () => {
    await testToggleCheckbox('autoDetectTokens', true);
  });

  it('toggles batch balance checks', async () => {
    await testToggleCheckbox('useMultiAccountBalanceChecker', false);
  });

  it('toggles metaMetrics', async () => {
    await testToggleCheckbox('participateInMetaMetrics', false);
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

  it('sets IPFS gateway', async () => {
    const user = userEvent.setup();
    renderWithProvider(<SecurityTab />, mockStore);

    const ipfsField = screen.getByDisplayValue(mockState.metamask.ipfsGateway);

    await user.click(ipfsField);

    await user.keyboard(
      '{Backspace}',
      // '{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}',
    );
  });

  it('clicks "Add Custom Network"', async () => {
    const user = userEvent.setup();
    renderWithProvider(<SecurityTab />, mockStore);

    await user.click(screen.getByText(t('addCustomNetwork')));
  });
});
