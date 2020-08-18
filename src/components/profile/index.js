import React, { useState, useContext } from 'react';
import { Context } from '../../providers/account';
import styles from './index.module.sass';
import EditProfile from '../EditProfile/';
import Message from '../../components/message';

import { Link } from 'react-router-dom';
import Icon from 'elektra-iconos';
import { ReactComponent as Location } from '../../components/icons/address-pin.svg';
import { ReactComponent as Shippings } from '../../components/icons/my-shippings.svg';
import { ReactComponent as Billing } from '../../components/icons/billings.svg';

const Profile = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const { state } = useContext(Context);
  const showAlert = state.__states.message.active;
  const breakpoint = state.__states.breakpoint;
  const isMobile = breakpoint === 'phone' || breakpoint === 'tablet';
  const profile = state.clientProfileData || {};

  return (
    <section className={`${styles.containerProfile} ${styles[breakpoint]}`}>
      <div className={styles.head}>
        <Icon icon="user" className={styles.user2} width="40" height="40" />
        <div className={styles.boxHead}>
          <div className={styles.titleSpecial}>Mi cuenta</div>
          {profile.firstName && <div className={styles.name}>{profile.firstName}</div>}
        </div>
      </div>
      <div className={styles.profileInfo}>
        <Icon icon="userOutline" className={styles.user} width="25" height="25" />
        <div className={styles.personalName}>
          <div className={styles.titleDescription}>Mis datos</div>
          <div className={styles.personalData}>
            {profile.firstName && <div>{`${profile.firstName} ${profile.lastName}`}</div>}
            <div>{profile.email}</div>
            <div>{profile.phone}</div>
          </div>
          <span
            className={styles.links}
            onClick={() => {
              setShowPopup(true);
            }}>
            Editar
          </span>
        </div>
      </div>
      <div className={styles.profileInfo}>
        <Location className={styles.iconFill} width="30" height="30" />
        <div className={styles.personal}>
          <div className={styles.titleDescription}>Mis direcciones</div>
          <Link to={`/address`}>
            <span className={styles.links}>Ver todas mis direcciones</span>
          </Link>
        </div>
      </div>
      <div className={styles.profileInfo}>
        <Shippings className={styles.iconFill} width="30" height="30" />
        <div className={styles.personal}>
          <div className={styles.titleDescription}>Mis pedidos</div>
          {!isMobile && (
            <Link to={`/orders`}>
              <span className={styles.links}>Ver todos mis pedidos</span>
            </Link>
          )}
          {isMobile && (
            <span onClick={props.onClick} className={styles.links}>
              Ver todos mis pedidos
            </span>
          )}
        </div>
      </div>
      <div className={styles.profileInfo}>
        <Billing className={styles.iconFill} width="30" height="30" />
        <div className={styles.personal}>
          <div className={styles.titleDescription}>Facturación</div>
          <a href={`/genera-tu-factura`}>
            <span className={styles.links}>Generar factura</span>
          </a>
        </div>
      </div>
      {showPopup && <EditProfile {...profile} onClose={() => setShowPopup(false)} />}
      {showAlert && (
        <Message
          active={true}
          type="success"
          icon="check"
          title={'Tu información fue actualizada con éxito'}
        />
      )}
    </section>
  );
};

export default Profile;
