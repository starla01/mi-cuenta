import React, { PureComponent } from 'react';
import styles from './index.module.sass';

class DropDown extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      focus: false
    };
  }
  render() {
    const props = this.props;
    const state = this.state;
    const overwrite = {};
    const propsInput = props.input || {};
    const focus = state.focus;

    var open = false;
    if (!focus) {
      overwrite.placeholder = '';
      open = false;
    } else open = true;
    if (propsInput.value) open = true;

    const attributes = {
      ...{
        onFocus: () => this.setState({ focus: true }),
        onBlur: () => this.setState({ focus: false })
      },
      ...propsInput,
      ...overwrite
    };

    return (
      <div
        className={`
          ${styles.DropDownRoot}
          ${(open && styles.open) || styles.close}
          ${(focus && styles.focus) || ''}
          ${(!!props.input.error && styles.error) || ''}
          ${(propsInput.disabled && styles.disabled) || ''}
        `}>
        <label htmlFor={propsInput.id || ''}>{props.label || ''}</label>
        <select {...attributes}>{props.children}</select>
        {(focus && <i className="material-icons">done</i>) || (
          <i className="material-icons">arrow_drop_down</i>
        )}
        {!!props.input.error && <div className={styles.errorDescription}>{props.input.error}</div>}
      </div>
    );
  }
}

export default DropDown;
