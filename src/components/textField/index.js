import React, { PureComponent } from 'react';
import styles from './index.module.sass';

const assign = Object.assign;

class TextField extends PureComponent {
  state = {
    focus: false
  };

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
    if (propsInput.value || propsInput.defaultValue) open = true;

    const inputAttributes = assign(
      {},
      propsInput,
      {
        onFocus: (e) => {
          if (propsInput.onFocus) propsInput.onFocus(e);
          this.setState({ focus: true });
        },
        onBlur: (e) => {
          if (propsInput.onBlur) propsInput.onBlur(e);
          this.setState({ focus: false });
        }
      },
      overwrite
    );

    return (
      <div
        className={`
        ${styles.TextFieldRoot}
        ${(open && styles.open) || styles.close}
        ${(focus && styles.focus) || ''}
        ${(!!props.input.error && styles.error) || ''}
        ${(inputAttributes.disabled && styles.disabled) || ''}
        ${props.className || ''}
        ${(props.label === 'Nombre completo' && styles.id) || ''}
        `}>
        <label htmlFor={propsInput.id || ''}>{props.label}</label>
        <input {...inputAttributes} />
        {!!props.input.error && <div className={styles.errorDescription}>{props.input.error}</div>}
      </div>
    );
  }
}

export default TextField;
