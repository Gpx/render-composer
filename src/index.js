function compose(wrappers) {
  return function({children}, data) {
    return wrappers.reverse().reduce(
      (acc, wrapper) => {
        let wrapperData;
        if (wrapper.data) {
          wrapperData =
            typeof wrapper.data === 'function' ? wrapper.data() : wrapper.data;
        } else {
          wrapperData = {};
        }
        const finalData = {...wrapperData, ...data};

        const ret = wrapper.ui
          ? wrapper.ui(acc.ui, finalData)
          : wrapper(acc.ui);
        return {ui: ret, data: {...acc.data, ...finalData}};
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
