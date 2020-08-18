import React from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.sass';

export default function Button(props) {
  return (
    <div className={`${styles.button} ${styles[props.type]}`} onClick={props.onClick}>
      {props.children}
    </div>
  );
}

export function CustomLink({ to, children, ...props }) {
  return (
    <Link {...props} to={to} className={styles.button}>
      {children}
    </Link>
  );
}

export function InputButton({ children, ...props }) {
  return (
    <button {...props} className={styles.button}>
      {children}
    </button>
  );
}
