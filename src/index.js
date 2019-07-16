function compose(wrappers) {
  return function({children}, data) {
    return wrappers.reverse().reduce(
      (acc, wrapper) => {
        const ret = wrapper.ui
          ? wrapper.ui(acc.ui, {...wrapper.data, ...data})
          : wrapper(acc.ui);
        return {ui: ret, data: {...acc.data, ...(wrapper.data || {}), ...data}};
      },
      {ui: children, data: {}},
    );
  };
}

export function renderCompose(wrappers, render) {
  return function(el, data = {}, options = {}) {
    const x = compose(wrappers)({children: el}, data);
    const utils = render(x.ui, options);
    return {...utils, ...x.data};
  };
}
