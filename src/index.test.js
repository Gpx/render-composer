import React from 'react';
import {render, cleanup} from '@testing-library/react';
import wrap from '.';
import '@testing-library/jest-dom/extend-expect';

beforeEach(cleanup);

test('it should allow to render a wrap', () => {
  const A = wrap(children => <div data-testid="A">{children}</div>);

  const composedRender = A.withRenderMethod(render);
  const {getByTestId} = composedRender(<div data-testid="Z" />);

  const z = getByTestId('Z');
  expect(z).toBeInTheDocument();

  const a = getByTestId('A');
  expect(a).toBeInTheDocument();
  expect(a).toContainElement(z);
});

test('it should allow to compose wraps', () => {
  const A = wrap(children => <div data-testid="A">{children}</div>);
  const B = wrap(children => <div data-testid="B">{children}</div>);
  const C = wrap(children => <div data-testid="C">{children}</div>);

  const composedRender = A.wraps(B)
    .wraps(C)
    .withRenderMethod(render);
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

test('it should allow to return data from wraps', () => {
  const A = wrap((children, {a}) => (
    <div>
      The value of a is {a}.{children}
    </div>
  )).defaultData({a: 'A'});
  const B = wrap(children => <div>{children}</div>);
  const C = wrap((children, {c}) => (
    <div>
      The value of c is {c}.{children}
    </div>
  )).defaultData({c: 'C'});

  const composedRender = A.wraps(B)
    .wraps(C)
    .withRenderMethod(render);
  const {getByText, a, c} = composedRender(<div />);

  expect(a).toBe('A');
  expect(getByText(`The value of a is A.`)).toBeInTheDocument();
  expect(c).toBe('C');
  expect(getByText(`The value of c is C.`)).toBeInTheDocument();
});

test('it should allow to randomly set data', () => {
  const composedRender = wrap((children, {a}) => <>{children}</>)
    .defaultData(() => ({
      a: Math.random(),
    }))
    .withRenderMethod(render);

  const firstRender = composedRender(<div />);
  const secondRender = composedRender(<div />);

  expect(firstRender.a).not.toBe(secondRender.a);
});

test('it should allow to overwrite data sent to wrappers', () => {
  const A = wrap((children, {a}) => (
    <div>
      The value of a is {a}.{children}
    </div>
  )).defaultData({a: 'A'});
  const B = wrap(children => <div>{children}</div>);
  const C = wrap((children, {c}) => (
    <div>
      The value of c is {c}.{children}
    </div>
  )).defaultData({c: 'C'});

  const composedRender = A.wraps(B)
    .wraps(C)
    .withRenderMethod(render);
  const {getByText, a, c} = composedRender(<div />, {a: 'a', c: 'c'});

  expect(a).toBe('a');
  expect(getByText(`The value of a is a.`)).toBeInTheDocument();
  expect(c).toBe('c');
  expect(getByText(`The value of c is c.`)).toBeInTheDocument();
});

test('wraps are immutable', () => {
  const A = wrap(children => <>{children}</>);
  const AWithData = A.defaultData({a: 'A'});

  expect(A).not.toBe(AWithData);

  const B = wrap(children => (
    <>
      <div data-testid="b" />
      {children}
    </>
  ));
  const C = wrap(children => (
    <>
      <div data-testid="c" />
      {children}
    </>
  ));
  expect(A).not.toBe(A.wraps(B));

  const firstRender = A.wraps(B).withRenderMethod(render)();
  expect(firstRender.getByTestId('b')).toBeInTheDocument();
  expect(firstRender.queryByTestId('c')).not.toBeInTheDocument();

  cleanup();

  const secondRender = A.wraps(C).withRenderMethod(render)();
  expect(firstRender.queryByTestId('b')).not.toBeInTheDocument();
  expect(firstRender.getByTestId('c')).toBeInTheDocument();
});
