import React, { useContext } from 'react';
import { Context } from '../../providers/account';
import styles from './index.module.sass';
import Icon from 'elektra-iconos';

const Message = ({ active, type, icon, title, text }) => {
  const { state } = useContext(Context);
  const breakpoint = state.__states.breakpoint;
  const isMobile = breakpoint === 'phone';

  return (
    (active && (
      <section id={styles.container}>
        <div id={styles.content} className={`${styles[type]} ${styles[breakpoint]}`}>
          {!isMobile && <div id={styles.icon}>
            <Icon width="50" height="50" icon={icon} />
          </div>}
          <section id={styles.data} className={styles[breakpoint]}>
            <h3 id={styles.title} className={styles[breakpoint]}>
              {title}
            </h3>
            {/*<div id={styles.text}>{text}</div>*/}
          </section>
        </div>
      </section>
    )) ||
    null
  );
};

export default Message;
