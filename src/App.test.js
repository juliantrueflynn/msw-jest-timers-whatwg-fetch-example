import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import App from './App';

const server = setupServer(
  rest.get('https://jsonplaceholder.typicode.com/todos/1', (_req, res, ctx) => {
    return res(ctx.json({id: '123', title: 'mocked todo'}))
  }),
);

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  // react-scripts uses jest v26 still which has "legacy" as default, legacy seems to work.
  jest.useFakeTimers('modern');
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

afterAll(() => {
  server.close();
});

test('renders todo title (expected to fail)', async () => {
  render(<App />);

  expect(screen.getByText('API status: idle')).toBeInTheDocument();
  expect(screen.queryByText('Todo title: mocked todo')).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button', {name: 'Button that triggers API'}));

  await waitForElementToBeRemoved(() => screen.queryByText('API status: pending'));

  expect(screen.getByText('Todo title: mocked todo')).toBeInTheDocument();
});

test('renders todo title (expected to pass)', async () => {
  server.events.on('response:mocked', () => {
    //
    jest.advanceTimersByTime(0);
  });

  render(<App />);

  expect(screen.getByText('API status: idle')).toBeInTheDocument();
  expect(screen.queryByText('Todo title: mocked todo')).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button', {name: 'Button that triggers API'}));

  await waitForElementToBeRemoved(() => screen.queryByText('API status: pending'));

  expect(screen.getByText('Todo title: mocked todo')).toBeInTheDocument();
});
