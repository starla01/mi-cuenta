import React from 'react';
import styles from './index.module.sass';
import { Link } from 'react-router-dom';

const Paginator = (props) => {
  return (
    <div className={styles.paginator}>
      {!!props.pages &&
        Array.from(Array(props.pages).keys()).map((page) => {
          const currentPage = (page !== 0 && page + 1) || 0;
          return (
            <Link key={page} to={`/orders?page=${currentPage}`}>
              <span
                className={`
                  ${styles.page}
                  ${props.currentPage === page + 1 && styles.active}
                `}>
                {page + 1}
              </span>
            </Link>
          );
        })}
    </div>
  );
};

export default Paginator;
