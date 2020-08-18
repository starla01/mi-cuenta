import styles from './index.module.sass';
import React, { useState, useContext } from 'react';
import { Context } from '../../providers/account';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import './datepicker.css';

registerLocale('es', es);

const DateField = (props) => {
  const [focus, setFocus] = useState(false);
  const { input, label } = props;
  const { error, $$name, ...inputHTMLAttributes } = input;
  const open = !!input.value || !!focus;
  const { state } = useContext(Context);
  const breakpoint = state.__states.breakpoint;

  return (
    <div>
      <div
        className={`${styles.TextFieldDateRoot} ${styles[breakpoint]}
      ${open && styles.open} ${focus && styles.focus} ${input.error && styles.error}
      ${props.className || ''}`}>
        <label htmlFor={input.id}>{label}</label>
        <DatePicker
          {...{
            selected: new Date(inputHTMLAttributes.value),
            name: $$name,
            onChange: (date) => {
              inputHTMLAttributes.onChange({
                target: {
                  value: date
                }
              });
            },
            onCalendarOpen: (e) => {
              if (input.onFocus)
                input.onFocus({
                  target: {
                    value: new Date(inputHTMLAttributes.value)
                  }
                });
              setFocus(true);
            },
            onCalendarClose: (e) => {
              if (input.onBlur)
                input.onBlur({
                  target: {
                    value: new Date(inputHTMLAttributes.value)
                  }
                });
              setFocus(false);
            },
            placeholder: focus ? input.placeholder || '' : ''
          }}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          locale="es"
          dateFormat="P"
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default DateField;
