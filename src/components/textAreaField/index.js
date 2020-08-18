import styles from './index.module.sass';
import React, { useState } from 'react';

const TextArea = (props) => {
  const [focus, setFocus] = useState(false);
  const { input, label, className, ...container } = props;
  const { error, $$name, ...inputHTMLAttributes } = input;
  const open = !!input.value || !!focus;
  const classNameString =
    styles.TextFieldRoot +
    ' ' +
    (open ? styles.open : styles.close) +
    ' ' +
    (focus ? styles.focus : '') +
    ' ' +
    (input.error ? styles.error : '') +
    ' ' +
    (props.className || '');
  return (
    <div
      {...{
        className: classNameString,
        ...container
      }}>
      <label htmlFor={input.id}>{label}</label>
      <textarea
        {...{
          ...inputHTMLAttributes,
          name: $$name,
          onFocus: (e) => {
            if (input.onFocus) input.onFocus(e);
            setFocus(true);
          },
          onBlur: (e) => {
            if (input.onBlur) input.onBlur(e);
            setFocus(false);
          },
          placeholder: focus ? input.placeholder || '' : ''
        }}
      />
      <i className="material-icons">close</i>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};
export default TextArea;
