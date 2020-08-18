import { useState } from 'react';

const useField = (props) => {
  const {
    name,
    value,
    errors = {},
    type = 'text',
    $$name = null,
    spellCheck = false,
    required = false,
    regexp = null,
    regexpOverwrite = false,
    placeholder = '',
    validateEvent = '',
    toLowerCase = false,
    toUpperCase = false,
    replacer = null,
    minlength = null,
    maxlength = null,
    customValidation = null,
    disabled = false
  } = props;

  const [data, setData] = useState({
    value: value || '',
    error: ''
  });

  if (!props) return {};

  const { requiredError = '', defaultError = '', minlengthError = '' } = errors;

  const validate = (config = {}) => {
    const { avoidValidation = false } = config;
    const value = data.value;
    let error = '';
    if (required && !value) error = requiredError;
    else if (minlength > value.length && !!value.length) error = minlengthError;
    else if (regexp && value) {
      if (!new RegExp(regexp).test(value)) error = defaultError;
    } else if (customValidation) {
      if (!customValidation(value)) error = defaultError;
    }
    if (!avoidValidation) setData((data) => ({ ...data, error }));
    return !!error;
  };

  const input = {
    $$name,
    disabled,
    spellCheck,
    placeholder,
    id: name,
    name: name,
    type: type || 'text',
    onChange: (e) => {
      let value = e.target.value;
      let error = '';
      if (toLowerCase) value = value.toLowerCase();
      else if (toUpperCase) value = value.toUpperCase();

      if (maxlength) value = value.substring(0, maxlength);

      if (validateEvent === 'change') {
        if (required && !value) error = requiredError;
        else if (minlength > value.length) error = minlengthError;
        else if (regexp && value) {
          if (!new RegExp(regexp).test(value)) error = defaultError;
        } else if (customValidation) {
          if (!customValidation(value)) error = defaultError;
        }

        if (regexp && regexpOverwrite) {
          value = (value.match(new RegExp(regexp)) || []).join('');
        }
      }

      if (replacer) value = replacer(value);

      setData({ value, error });
    },
    onBlur: (e) => {
      let value = e.target.value;
      let error = '';

      if (validateEvent === 'blur') {
        if (required && !value) error = requiredError;
        else if (minlength > value.length) error = minlengthError;
        else if (regexp && value) {
          if (!new RegExp(regexp).test(value)) error = defaultError;
        } else if (customValidation) {
          if (!customValidation(value)) error = defaultError;
        }
      }

      setData({ value, error });
    },
    ...data
  };

  return { input, setData, validate, type };
};

const createErrors = (fields) => {
  return fields
    .flatMap((field) => {
      if (!field) return null;
      else if (field.fields) return createErrors(field.fields);
      else if (field.input) return field.validate() && field;
    })
    .filter((field) => !!field);
};

const createData = (field) => {
  if (!field) return null;
  else if (field.fields) {
    let object = {};
    field.fields.forEach((field) => {
      if (field) {
        if (field.name) {
          object = {
            ...object,
            [field.name]: field.fields.map(({ fields }) => createData({ fields }))
          };
        } else {
          const data = createData(field);
          object = { ...object, ...data };
        }
      }
    });
    return object;
  } else if (field.input) {
    return { [field.input.$$name || field.input.name]: field.input.value };
  }
};

const validateData = (fields) => {
  const errorsArray = createErrors(fields);
  const data = createData({ fields });
  const errors = (errorsArray.length && errorsArray) || void 0;
  return { data, errors };
};

const methods = {
  useField,
  validateData
};

export default methods;
