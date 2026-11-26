import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BenchmarkRun, BenchmarkValue } from '../../stores/BenchmarkTypes';
import { VisualizeBenchmark } from './VisualizeBenchmarks';

jest.mock('../../utils', () => ({
  mapDesirabilityToColor: (value: number) => value > 0.9 ? '#48c946' : value < -0.9 ? '#fc9d5a' : '#ffffff',
}));

const value = (v: BenchmarkValue['value'], label?: string): BenchmarkValue => ({
  value: v,
  label,
  desirability: 0,
});

const workflow = (name: string, duration: BenchmarkValue['value'], status: BenchmarkValue['value']): BenchmarkRun => ({
  workflowName: name,
  executor: 'executor',
  runID: name,
  inputs: {},
  benchmarks: [
    { title: 'Duration', unit: 's', description: '', category: undefined, aggregate_value: value(duration), steps: [value(duration, `${name} step`)] },
    { title: 'Status', unit: '', description: '', category: undefined, aggregate_value: value(status), steps: [value(status, `${name} step`)] },
  ],
});

const upload = async (runs: BenchmarkRun[]) => {
  const file = new File([JSON.stringify(runs)], 'benchmarks.json', { type: 'application/json' });
  fireEvent.change(screen.getByLabelText('Upload JSON file'), { target: { files: [file] } });
  await waitFor(() => expect(screen.getByText(runs[0].workflowName)).toBeTruthy());
};

const rowLabels = () => within(screen.getByRole('table'))
  .getAllByRole('row')
  .slice(1)
  .map(row => within(row).getAllByRole('cell')[1].textContent);

test('sorts aggregate values in either direction and keeps expanded steps with their workflow', async () => {
  render(<VisualizeBenchmark />);
  await upload([
    workflow('Ten', 10, 'beta'),
    workflow('Negative', -2, 'gamma'),
    workflow('Two', '2', 'alpha'),
    workflow('Equal', 2, 'delta'),
  ]);
  expect(rowLabels()).toEqual(['Ten', 'Negative', 'Two', 'Equal']);
  fireEvent.click(within(screen.getByText('Two').closest('tr')!).getByRole('button'));

  const ascending = screen.getByRole('button', { name: 'Sort Duration ascending' });
  fireEvent.click(ascending);
  expect(rowLabels()).toEqual(['Negative', 'Two', 'Two step', 'Equal', 'Ten']);
  expect(ascending.getAttribute('aria-pressed')).toBe('true');
  expect(ascending.closest('th')?.getAttribute('aria-sort')).toBe('ascending');

  fireEvent.click(screen.getByRole('button', { name: 'Sort Duration descending' }));
  expect(rowLabels()).toEqual(['Ten', 'Two', 'Two step', 'Equal', 'Negative']);
  expect(ascending.closest('th')?.getAttribute('aria-sort')).toBe('descending');
  expect(ascending.getAttribute('aria-pressed')).toBe('false');

  fireEvent.click(screen.getByRole('button', { name: 'Sort Status ascending' }));
  expect(rowLabels()).toEqual(['Two', 'Two step', 'Ten', 'Equal', 'Negative']);
});

test('sorts booleans and leaves missing values last in both directions', async () => {
  const missing = workflow('Missing', 0, true);
  missing.benchmarks.pop();
  render(<VisualizeBenchmark />);
  await upload([workflow('True', 1, true), missing, workflow('False', 2, false)]);

  fireEvent.click(screen.getByRole('button', { name: 'Sort Status ascending' }));
  expect(rowLabels()).toEqual(['False', 'True', 'Missing']);
  fireEvent.click(screen.getByRole('button', { name: 'Sort Status descending' }));
  expect(rowLabels()).toEqual(['True', 'False', 'Missing']);
});

test('a new upload resets sorting and expanded rows', async () => {
  render(<VisualizeBenchmark />);
  await upload([workflow('First', 2, true), workflow('Second', 1, false)]);
  fireEvent.click(within(screen.getByText('First').closest('tr')!).getByRole('button'));
  fireEvent.click(screen.getByRole('button', { name: 'Sort Duration ascending' }));
  expect(rowLabels()).toEqual(['Second', 'First', 'First step']);

  await upload([workflow('First', 3, true), workflow('New', 0, false)]);
  await waitFor(() => expect(rowLabels()).toEqual(['First', 'New']));
  expect(screen.getByRole('button', { name: 'Sort Duration ascending' }).getAttribute('aria-pressed')).toBe('false');
});

test('scientific numeric benchmarks sort closest to a target, with ties stable and invalid values last', async () => {
  const runs = [
    workflow('Far', 9, 'text'),
    workflow('Above', 2, 'text'),
    workflow('Below', 0, 'text'),
    workflow('Exact', '1', 'text'),
    workflow('Invalid', false, 'text'),
    workflow('Missing', 0, 'text'),
  ];
  runs.forEach(run => { run.benchmarks[0].category = 'Scientific'; });
  runs[5].benchmarks.shift();
  render(<VisualizeBenchmark />);
  await upload(runs);
  expect(screen.queryByRole('button', { name: 'Sort Status by target' })).toBeNull();
  fireEvent.click(within(screen.getByText('Above').closest('tr')!).getByRole('button'));
  fireEvent.click(screen.getByRole('button', { name: 'Sort Duration by target' }));
  const input = screen.getByRole('spinbutton', { name: 'Duration target value (s)' });
  userEvent.type(input, '{enter}');
  expect(screen.getByRole('alert').textContent).toBe('Enter a finite numeric target.');
  expect(rowLabels()).toEqual(['Far', 'Above', 'Above step', 'Below', 'Exact', 'Invalid', 'Missing']);

  fireEvent.change(input, { target: { value: '1' } });
  userEvent.type(input, '{enter}');
  expect(rowLabels()).toEqual(['Exact', 'Above', 'Above step', 'Below', 'Far', 'Invalid', 'Missing']);
  const targetButton = screen.getByRole('button', { name: 'Sort Duration by target' });
  expect(targetButton.getAttribute('aria-pressed')).toBe('true');
  expect(targetButton.closest('th')?.getAttribute('aria-sort')).toBe('other');
  expect((screen.getByRole('spinbutton', { name: 'Duration target value (s)' }) as HTMLInputElement).value).toBe('1');

  fireEvent.click(targetButton);
  expect((screen.getByRole('spinbutton', { name: 'Duration target value (s)' }) as HTMLInputElement).value).toBe('1');
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Duration target value (s)' }), { target: { value: '-1.5' } });
  userEvent.type(screen.getByRole('spinbutton', { name: 'Duration target value (s)' }), '{enter}');
  expect(rowLabels()).toEqual(['Below', 'Exact', 'Above', 'Above step', 'Far', 'Invalid', 'Missing']);
  fireEvent.click(screen.getByRole('button', { name: 'Sort Duration descending' }));
  expect(targetButton.getAttribute('aria-pressed')).toBe('false');
});

test('target option requires a scientific category and numeric values, and resets on upload', async () => {
  const technical = workflow('Technical', 4, 'text');
  technical.benchmarks[0].category = 'technical';
  technical.benchmarks[1].category = 'scientific';
  const scientific = workflow('Scientific', 3, 'text');
  scientific.benchmarks[0].category = 'scientific';
  render(<VisualizeBenchmark />);
  await upload([technical]);
  expect(screen.queryByRole('button', { name: 'Sort Duration by target' })).toBeNull();
  expect(screen.queryByRole('button', { name: 'Sort Status by target' })).toBeNull();

  await upload([scientific]);
  fireEvent.click(screen.getByRole('button', { name: 'Sort Duration by target' }));
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Duration target value (s)' }), { target: { value: '2' } });
  userEvent.type(screen.getByRole('spinbutton', { name: 'Duration target value (s)' }), '{enter}');
  expect(screen.getByRole('button', { name: 'Sort Duration by target' }).getAttribute('aria-pressed')).toBe('true');

  await upload([workflow('New upload', 1, 'text')]);
  expect(screen.queryByRole('button', { name: 'Sort Duration by target' })).toBeNull();
});

test('keeps the active target visible while editing a different scientific benchmark', async () => {
  const first = workflow('First', 2, 8);
  const second = workflow('Second', 1, 4);
  [first, second].forEach(run => {
    run.benchmarks[0].category = 'scientific';
    run.benchmarks[1].category = 'scientific';
  });
  render(<VisualizeBenchmark />);
  await upload([first, second]);
  fireEvent.click(screen.getByRole('button', { name: 'Sort Duration by target' }));
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Duration target value (s)' }), { target: { value: '1' } });
  userEvent.type(screen.getByRole('spinbutton', { name: 'Duration target value (s)' }), '{enter}');
  fireEvent.click(screen.getByRole('button', { name: 'Sort Status by target' }));
  expect((screen.getByRole('spinbutton', { name: 'Duration target value (s)' }) as HTMLInputElement).value).toBe('1');
  expect(screen.getByRole('spinbutton', { name: 'Status target value' })).toBeTruthy();
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Status target value' }), { target: { value: '7' } });
  userEvent.type(screen.getByRole('spinbutton', { name: 'Status target value' }), '{enter}');
  expect(screen.queryByRole('spinbutton', { name: 'Duration target value (s)' })).toBeNull();
  expect((screen.getByRole('spinbutton', { name: 'Status target value' }) as HTMLInputElement).value).toBe('7');
});

  test('colors workflow aggregates by relative target distance and restores original colors', async () => {
    const runs = [
      workflow('Exact', 1, 100),
      workflow('Near', 2, 200),
      workflow('Far', 3, 300),
      workflow('Invalid', 'unknown', 400),
    ];
    runs.forEach(run => {
      run.benchmarks[0].category = 'scientific';
      run.benchmarks[0].aggregate_value.desirability = -1;
      run.benchmarks[1].aggregate_value.desirability = 1;
    });
    render(<VisualizeBenchmark />);
    await upload(runs);
    const cellColor = (name: string, index: number) =>
      (within(screen.getByText(name).closest('tr')!).getAllByRole('cell')[index].querySelector('.benchmark-value') as HTMLElement).style.backgroundColor;
    fireEvent.click(within(screen.getByText('Exact').closest('tr')!).getByRole('button'));
    fireEvent.click(screen.getByRole('button', { name: 'Sort Duration by target' }));
    const input = screen.getByRole('spinbutton', { name: 'Duration target value (s)' });
    fireEvent.change(input, { target: { value: '1' } });
    userEvent.type(input, '{enter}');
    expect(cellColor('Exact', 2)).toBe('rgb(72, 201, 70)');
    expect(cellColor('Near', 2)).toBe('rgb(255, 255, 255)');
    expect(cellColor('Far', 2)).toBe('rgb(252, 157, 90)');
    expect(cellColor('Invalid', 2)).toBe('rgb(255, 255, 255)');
    expect(cellColor('Exact', 3)).toBe('rgb(72, 201, 70)');
    expect(cellColor('Exact step', 2)).toBe('rgb(255, 255, 255)');

    fireEvent.change(input, { target: { value: '3' } });
    expect(cellColor('Exact', 2)).toBe('rgb(72, 201, 70)');
    userEvent.type(input, '{enter}');
    expect(cellColor('Far', 2)).toBe('rgb(72, 201, 70)');
    expect(cellColor('Exact', 2)).toBe('rgb(252, 157, 90)');
    fireEvent.click(screen.getByRole('button', { name: 'Sort Duration ascending' }));
    expect(cellColor('Far', 2)).toBe('rgb(252, 157, 90)');
    expect(cellColor('Exact', 2)).toBe('rgb(252, 157, 90)');
  });

  test('equal distances and a single numeric workflow are green', async () => {
    const first = workflow('Left', 0, 'x');
    const second = workflow('Right', 2, 'x');
    [first, second].forEach(run => { run.benchmarks[0].category = 'scientific'; });
    render(<VisualizeBenchmark />);
    await upload([first, second]);
    fireEvent.click(screen.getByRole('button', { name: 'Sort Duration by target' }));
    const input = screen.getByRole('spinbutton', { name: 'Duration target value (s)' });
    fireEvent.change(input, { target: { value: '1' } });
    userEvent.type(input, '{enter}');
    for (const name of ['Left', 'Right']) {
      const span = screen.getByText(name).closest('tr')!.querySelector('.benchmark-value') as HTMLElement;
      expect(span.style.backgroundColor).toBe('rgb(72, 201, 70)');
    }
    await upload([first]);
    await waitFor(() => expect(rowLabels()).toEqual(['Left']));
    fireEvent.click(screen.getByRole('button', { name: 'Sort Duration by target' }));
    const singleInput = screen.getByRole('spinbutton', { name: 'Duration target value (s)' });
    fireEvent.change(singleInput, { target: { value: '20' } });
    userEvent.type(singleInput, '{enter}');
    const span = screen.getByText('Left').closest('tr')!.querySelector('.benchmark-value') as HTMLElement;
    expect(span.style.backgroundColor).toBe('rgb(72, 201, 70)');
  });
