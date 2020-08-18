import React, { useContext } from 'react';
import styles from './index.module.sass';
import TextField from '../textField/';
import inputMethods from '../../hooks/useInputForm';
import { Context } from '../../providers/account';
import Button from '../../components/button/';
import { ReactComponent as Close } from '../../components/icons/close.svg';

const { useInputForm, validateData } = inputMethods;

const EditProfile = (props) => {
  const { actions, state } = useContext(Context);
  const breakpoint = state.__states.breakpoint;
  const isMobile = breakpoint === 'phone';
  const orderId = state.orderFormId;

  const firstName = useInputForm({
    name: 'firstName',
    value: props.firstName || ''
  });
  const lastName = useInputForm({
    name: 'lastName',
    value: props.lastName || ''
  });
  const email = useInputForm({
    name: 'email',
    value: props.email || '',
    fieldType: 'EMAIL'
  });
  const phone = useInputForm({
    name: 'phone',
    value: props.phone || '',
    fieldType: 'PHONE'
  });

  return (
    <section className={styles.wrapperPopUpContainer}>
      <div className={`${styles.containerPopup} ${styles[breakpoint]}`}>
        <div className={styles.headerPop}>
          <span>Editar mis datos personales</span>
          <Close onClick={props.onClose} />
        </div>
        <div className={styles.containerForm}>
          <div className={`${styles.rowPopup} ${styles[breakpoint]}`}>
            <TextField label="Nombre" input={firstName.input} />
            <TextField label="Apellidos" input={lastName.input} />
          </div>
          <div className={`${styles.rowPopup} ${styles[breakpoint]}`}>
            <TextField
              className={styles.No}
              label="Correo electrónico"
              input={{
                value: props.email,
                disabled: true
              }}
            />
            <TextField label="Télefono" input={phone.input} />
          </div>
        </div>
        <div className={`${styles.footerPop} ${styles[breakpoint]}`}>
          <div className={styles.cancelarPopButton} onClick={props.onClose}>
            Cancelar
          </div>
          <Button
            onClick={() => {
              const data = validateData([firstName, lastName, email, phone]);
              if (!data) return;
              actions.sendProfile(data, orderId);
              props.onClose();
            }}>
            {isMobile ? 'Guardar' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EditProfile;
