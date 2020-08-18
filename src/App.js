import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import AccountProvider from './providers/account';
import Address from './views/Address';
import OrderList from './views/OrderList/';
import OrderDetail from './views/OrderDetail';
import AccountRoute from './components/accountRoute';
import CancelOrder from './views/CancelOrders/';
import OrderCanceled from './views/OrderCanceled';
import ListProductsCanceled from './views/ListProductsCanceled';

import styles from './App.css';

const App = () => (
  <Router basename="/_secure/account">
    <Switch>
      <AccountProvider>
        <main className={styles.main}>
          <AccountRoute exact path="/order-canceled/:orderId/:folioId" component={OrderCanceled} />
          <AccountRoute exact path="/seleccionar-articulos/" component={ListProductsCanceled} />
          <AccountRoute exact path="/cancelar-mi-pedido" component={CancelOrder} />
          <AccountRoute exact path="/order-detail" component={OrderDetail} />
          <AccountRoute exact path="/profile" component={OrderList} />
          <AccountRoute exact path="/address" component={Address} />
          <AccountRoute exact path="/orders" component={OrderList} />
        </main>
      </AccountProvider>
    </Switch>
  </Router>
);

export default App;
