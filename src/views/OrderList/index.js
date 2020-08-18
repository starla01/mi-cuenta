import React, { useEffect, useState } from 'react';
import styles from './index.module.sass';
import Profile from '../../components/profile/';
import List from '../../components/list/';
import Spinner from '../../components/Spinner/';
import { ReactComponent as Shippings } from '../../components/icons/my-shippings.svg';
import { ReactComponent as User } from '../../components/icons/user.svg';
import Paginator from '../../components/paginator';

const desktopBannerDelayURL = 'https://elektra.vteximg.com.br/arquivos/package-desktop.png';
const mobileBannerDelayURL = 'https://elektra.vteximg.com.br/arquivos/package-mobile.png';

const OrderList = ({ state, actions }) => {
  const items = state.shippments;
  const [showProfile, setShowProfile] = useState(true);
  const [showOrder, setShowOrders] = useState(false);
  const breakpoint = state.__states.breakpoint;
  const isMobile = breakpoint === 'phone' || breakpoint === 'tablet';

  useEffect(() => {
    actions.getOrders();
  }, [window.location.search]);

  if (!items && !state.__states.fetchCompletedOrders && !state.__statesfetchCompletedOrders)
    return <Spinner />;

  const noElements = (
    <div className={styles.empty}>
      <Shippings className={styles.iconFillEmpty} width="130" height="130" />
      <div>¡Aún no tienes pedidos!</div>
    </div>
  );

  const { currentPage, perPage, total } = state.pages;

  const elements = items.map((item, index) => {
    return (
      <List
        key={index}
        orderNumber={item.orderId}
        item={item.items}
        status={item.status}
        date={item.creationDate}
        total={item.value}
        seller={item.sellers}
        order={item}
      />
    );
  });

  const bannerOderDelay = (
    <div className={`${styles.bannerContainer} ${!isMobile && styles.bannerContainerDesktop}`}>
      <img
        alt="Entrega asegurada"
        src={(isMobile && mobileBannerDelayURL) || desktopBannerDelayURL}
      />
      <div className={styles.bannerTextContainer}>
        <div className={`${(isMobile && styles.bannerTextMobile) || styles.bannerTextDesktop}`}>
          Debido a la alta demanda de pedidos en las últimas semanas, es posible que tu pedido
          presente algún atraso, de ser así te notificaremos por correo electrónico.
          <b className={styles.bannerTextColor}> ¡En Elektra estamos contigo!</b>
        </div>
      </div>
    </div>
  );

  return (
    <div id={styles.container} className={styles[breakpoint]}>
      {isMobile && bannerOderDelay}
      {isMobile && (
        <div className={styles.options}>
          <div
            className={showProfile ? styles.profileButtonActive : styles.profileButton}
            onClick={() => {
              setShowProfile(true);
              setShowOrders(false);
            }}>
            <User
              className={showProfile ? styles.iconActive : styles.icon}
              width="30"
              height="30"
            />
            <div>Mis Datos</div>
          </div>
          <div
            className={showOrder ? styles.ordersButtonActive : styles.ordersButton}
            onClick={() => {
              setShowOrders(true);
              setShowProfile(false);
            }}>
            <Shippings
              className={showOrder ? styles.iconActive : styles.iconShip}
              width="30"
              height="30"
            />
            <div>Mis pedidos</div>
          </div>
        </div>
      )}

      {isMobile && showProfile && (
        <Profile
          onClick={() => {
            setShowOrders(true);
            setShowProfile(false);
          }}
        />
      )}
      {!isMobile && <Profile />}
      <section className={`${styles.containerList} ${styles[breakpoint]}`}>
        {!isMobile && (
          <div className={styles.title}>
            <Shippings className={styles.iconFill} width="33" height="33" />
            <span>Mis Pedidos</span>
          </div>
        )}
        {isMobile && showOrder && (
          <div className={styles.showOrders}>
            {(total <= perPage && (
              <div>
                <span>Mostrando </span>
                <span className={styles.bolders}>{total}</span>
                <span> de </span>
                <span className={styles.bolders}>{total} </span>
                <span>pedidos.</span>
              </div>
            )) || (
              <div>
                <span>Mostrando </span>
                <span className={styles.bolders}>
                  {currentPage * perPage > total ? (
                    <span>{total}</span>
                  ) : (
                    <span>{currentPage * perPage}</span>
                  )}
                </span>
                <span> de </span>
                <span className={styles.bolders}>{total} </span>
                <span>pedidos.</span>
              </div>
            )}
          </div>
        )}
        {!isMobile && (
          <div className={styles.showOrders}>
            {(total <= perPage && (
              <div>
                <span>Mostrando </span>
                <span className={styles.bolders}>{total}</span>
                <span> de </span>
                <span className={styles.bolders}>{total} </span>
                <span>pedidos.</span>
              </div>
            )) || (
              <div>
                <span>Mostrando </span>
                <span className={styles.bolders}>
                  {currentPage * perPage > total ? (
                    <span>{total}</span>
                  ) : (
                    <span>{currentPage * perPage}</span>
                  )}
                </span>
                <span> de </span>
                <span className={styles.bolders}>{total} </span>
                <span>pedidos.</span>
              </div>
            )}
          </div>
        )}
        {!isMobile && bannerOderDelay}
        {isMobile && showOrder && <>{!items.length ? noElements : elements}</>}
        {!isMobile && <>{!items.length ? noElements : elements}</>}
        {isMobile && showOrder && !!items.length && <Paginator {...state.pages} />}
        {!isMobile && !!items.length && <Paginator {...state.pages} />}
      </section>
    </div>
  );
};

export default OrderList;
