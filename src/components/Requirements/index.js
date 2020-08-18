import React, { useContext } from 'react';
import styles from './index.module.sass';
import { Context } from '../../providers/account';

const Requirements = () => {
  const { state } = useContext(Context);
  const breakpoint = state.__states.breakpoint;
  return (
    <div className={`${styles.container} ${styles[breakpoint]}`}>
      <span>Para realizar el reembolso en efectivo es necesario:</span>
      <ul>
        <li>Ser mayor de edad.</li>
        <li>
          Capturar nombre completo de la persona que realizó el pedido como aparece en la
          identificación oficial INE / IFE.
        </li>
        <li>Confirmar fecha de nacimiento.</li>
      </ul>
      <span>
        Si eres menor de edad y deseas cancelar tu pedido, comunícate con nosotros al teléfono 55
        7577 5547{' '}
      </span>
    </div>
  );
};

export default Requirements;
