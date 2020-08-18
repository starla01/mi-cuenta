import { useState } from 'react';

const useTextareaForm = ({ name, value, fieldType = 'REQUIRED', min = 0, max = Infinity }) => {
  const [data, setData] = useState({
    value: value || '',
    error: ''
  });
  const textarea = {
    id: name,
    name: name,
    onChange: (e) => {
      if (fieldType === 'POSTALCODE') {
        setData({
          value: e.target.value.replace(/[^\d]/g, '').substring(0, 5),
          error: ''
        });
      } else if (fieldType === 'PHONE') {
        setData({
          value: e.target.value.replace(/[^\d]/g, '').substring(0, 10),
          error: ''
        });
      } else if (fieldType !== 'EMAIL') {
        setData({
          value: e.target.value.replace(/[^a-zÁ-ú0-9´ ]+/gi, '').substring(0, max),
          error: ''
        });
      } else {
        setData({
          value: e.target.value.substring(0, max),
          error: ''
        });
      }
    },
    onBlur: (e) => {
      if (fieldType === 'REQUIRED') {
        if (!e.target.value)
          setData({
            value: '',
            error: 'Este campo es obligatorio'
          });

        if (min && e.target.value.length < min)
          setData((data) => ({
            ...data,
            error: `Ingresa por lo menos ${min} caracteres`
          }));
      }
      if (fieldType === 'POSTALCODE') {
        if (e.target.value.length < 5)
          setData((data) => ({
            ...data,
            error: 'Ingresa por lo menos 5 caracteres'
          }));
      }
      if (fieldType === 'EMAIL') {
        const value = e.target.value;
        // eslint-disable-next-line no-useless-escape
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const valid = regex.test(value);
        let error = '';
        if (!value) error = 'Este campo es obligatorio';
        else if (!valid) error = 'Introduce un correo válido';
        setData((data) => ({ ...data, error }));
      }
      if (fieldType === 'PHONE') {
        const value = e.target.value;
        let error = '';
        if (!value) error = 'Este campo es obligatorio';
        if (value.length < 10) {
          error = 'Por favor introduce un télefono válido a 10 dígitos';
        }
        setData((data) => ({ ...data, error }));
      } else if (min && e.target.value.length < min && !!e.target.value) {
        setData((data) => ({
          ...data,
          error: `Ingresa por lo menos ${min} caracteres`
        }));
      }
    },
    ...data
  };

  return { textarea, setData, fieldType, min, max };
};

const validateData = (fields) => {
  const errors = fields.filter(
    (field) =>
      !!field.textarea.error ||
      (!field.textarea.value && field.fieldType !== 'OPTIONAL') ||
      (field.min && field.textarea.value < field.min && !!field.textarea.value.length)
  );

  if (errors.length) {
    errors.forEach((field) => {
      field.setData((data) => ({
        ...data,
        error:
          (!data.value && 'Este campo es obligatorio') ||
          ((field.min &&
            field.min > data.value.length &&
            `Ingresa por lo menos ${field.min} caracteres`) ||
            'Introduce un valor correcto')
      }));
    });

    return null;
  } else {
    const data = {};
    fields.forEach((field) => (data[field.textarea.name] = field.textarea.value));
    return data;
  }
};

const methods = {
  useTextareaForm,
  validateData
};

export default methods;
