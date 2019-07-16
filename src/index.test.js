import React from 'react';
import {render, cleanup} from '@testing-library/react';
import {renderCompose} from '.';
import '@testing-library/jest-dom/extend-expect';

beforeEach(cleanup);

test('it should allow to compose render methods', () => {
  const A = children => <div data-testid="A">{children}</div>;
  const B = children => <div data-testid="B">{children}</div>;
  const C = children => <div data-testid="C">{children}</div>;

  const composedRender = renderCompose([A, B, C], render);
  const {getByTestId} = composedRender(<div data-testid="Z" />);

  const z = getByTestId('Z');
  expect(z).toBeInTheDocument();

  const c = getByTestId('C');
  expect(c).toBeInTheDocument();
  expect(c).toContainElement(z);

  const b = getByTestId('B');
  expect(b).toBeInTheDocument();
  expect(b).toContainElement(c);

  const a = getByTestId('A');
  expect(a).toBeInTheDocument();
  expect(a).toContainElement(b);
});

test('it should allow to return data from render methods', () => {
  const A = {
    ui: (children, {a}) => (
      <div>
        The value of a is {a}.{children}
      </div>
    ),
    data: {a: 'A'},
  };
  const B = children => <div>{children}</div>;
  const C = {
    ui: (children, {c}) => (
      <div>
        The value of c is {c}.{children}
      </div>
    ),
    data: {c: 'C'},
  };

  const composedRender = renderCompose([A, B, C], render);
  const {getByText, a, c} = composedRender(<div />);

  expect(a).toBe('A');
  expect(getByText(`The value of a is A.`)).toBeInTheDocument();
  expect(c).toBe('C');
  expect(getByText(`The value of c is C.`)).toBeInTheDocument();
});

test('it should allow to overwrite data sent to wrappers', () => {
  const A = {
    ui: (children, {a}) => (
      <div>
        The value of a is {a}.{children}
      </div>
    ),
    data: {a: 'A'},
  };
  const B = children => <div>{children}</div>;
  const C = {
    ui: (children, {c}) => (
      <div>
        The value of c is {c}.{children}
      </div>
    ),
    data: {c: 'C'},
  };

  const composedRender = renderCompose([A, B, C], render);
  const {getByText, a, c} = composedRender(<div />, {a: 'a', c: 'c'});

  expect(a).toBe('a');
  expect(getByText(`The value of a is a.`)).toBeInTheDocument();
  expect(c).toBe('c');
  expect(getByText(`The value of c is c.`)).toBeInTheDocument();
});
