class Wrap {
  constructor({ui, childWrap, data = {}}) {
    this.ui = ui;
    this.childWrap = childWrap;
    this.data = data;
  }

  __render(child, data) {
    let ui;
    const thisData = typeof this.data === 'function' ? this.data() : this.data;
    let finalData = {...thisData, ...data};
    if (this.childWrap) {
      const childResult = this.childWrap.__render(child, data);
      ui = this.ui(childResult.ui, finalData);
      finalData = {...finalData, ...childResult.data};
    } else {
      ui = this.ui(child, finalData);
    }
    return {ui, data: finalData};
  }

  wraps(childWrap) {
    if (this.childWrap) {
      this.childWrap.wraps(childWrap);
    } else {
      this.childWrap = childWrap;
    }
    return this;
  }

  defaultData(data) {
    this.data = data;
    return this;
  }

  withRenderMethod(render, opts) {
    return (child, data = {}) => {
      const renderResult = this.__render(child, data);
      const utils = render(renderResult.ui, opts);
      return {...utils, ...renderResult.data};
    };
  }
}

export default function wrap(ui) {
  return new Wrap({ui});
}
