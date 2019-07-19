<div align="center">
<h1>Render Composer</h1>

<a href="https://www.joypixels.com/emoji/1f32f">
  <img
    height="80"
    width="80"
    alt="burrito"
    src="https://raw.githubusercontent.com/Gpx/render-composer/master/other/burrito.png"
  />
</a>

<p>Create complex renders for <a href="https://github.com/testing-library/react-testing-library">react-testing-library</a></p>

<br />
</div>

<hr />

## The problem

When working with Testing Library within a large project often you need to wrap your component
in several providers:

```jsx
const history = createMemoryHistory();
const locale = 'en';
const user = {name: 'Giorgio'};
render(
  <Router history={history}>
    <IntlProvider locale={locale}>
      <UserContext.Provider value={user}>
        <MyComponent />
      </UserContext.Provider>
    </IntlProvider>
  </Router>,
);
```

This can lead to a lot of overhead and is not very flexible.

## The solution

Render Composer allows you to declare reusable and configurable _wraps_ that define
a single provider. These wraps can then be combined to generate more complex hierarchies.

```jsx
const RouterWrap = wrap((children, {history}) => (
  <Router history={history}>{children}</Router>
)).defaultData(() => ({
  history: createMemoryHistory(),
}));
const IntlWrap = wrap((children, {locale}) => (
  <IntlProvider locale={locale}>{children}</IntlProvider>
)).defaultData({locale: 'en'});
const UserWrap = wrap((children, {user}) => (
  <UserContext.Provider value={user}>{children}</UserContext.Provider>
)).defaultData({user: {name: 'Giorgio'}});

const appRender = RouterWrap.wraps(IntlWrap)
  .wraps(UserWrap)
  .withRenderMethod(render);

appRender(<MyComponent />);
```

## Installation

With NPM:

```sh
npm install @gpx/render-composer --save-dev
```

With Yarn:

```sh
yarn add @gpx/render-composer --dev
```

Now simply import it in your tests:

```js
import wrap from '@gpx/render-composer';

// or

var wrap = require('@gpx/render-composer');
```

## Usage

You can create a wrap with the `wrap` method:

```jsx
const Wrap = wrap((children, data) => <div>{children}</div>);
```

`data` is an empty object by default. You can set some default values with `defaultData`:

```jsx
Wrap.defaultData({foo: 'bar'});
```

If you need the data to be generated every time rather than be static you can also
pass a function to `defaultData`:

```jsx
Wrap.defaultData(() => ({foo: 'bar'}));
```

You can compose the wraps with the `wraps` method. You can chain as many wraps you want:

```jsx
WrapA.wraps(WrapB)
  .wraps(WrapC)
  .wraps(WrapD);
```

Once you are satisfied with your wrap you can get genera a render method with `withRenderMethod`:

```jsx
import {render} from '@testing-library/react';

const renderWrap = Wrap.withRenderMethod(render);

renderWrap(<MyComponent />);
```

The generated render method will also accept data to overwrite the default values you
defined in your wraps. The data will be returned too:

```jsx
Wrap.defaultData(() => ({foo: 'bar'}));

// This `foo` will have value `'bar'`
const {foo} = renderWrap(<MyComponent />);

// This `foo` will have value `'baz'`
const {foo} = renderWrap(<MyComponent />, {foo: 'baz'});
```

Note that wraps are immutable so that they can be defined in one file and exported and combined.
