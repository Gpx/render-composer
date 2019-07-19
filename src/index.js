import cloneDeep from 'lodash.clonedeep';

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
    const clone = cloneDeep(this);

    if (clone.childWrap) {
      const childWrapClone = clone.childWrap.wraps(childWrap);
      clone.childWrap = childWrapClone;
    } else {
      clone.childWrap = childWrap;
    }
    return clone;
  }

  defaultData(data) {
    const clone = cloneDeep(this);
    clone.data = data;
    return clone;
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
