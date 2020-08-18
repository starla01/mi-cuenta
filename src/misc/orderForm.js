const expectedOrderFormSections = [
  'items',
  'totalizers',
  'clientProfileData',
  'shippingData',
  'paymentData',
  'sellers',
  'messages',
  'marketingData',
  'clientPreferencesData',
  'storePreferencesData',
  'giftRegistryData',
  'ratesAndBenefitsData',
  'openTextField'
];

export default {
  getOrderForm: () => {
    return fetch('/api/checkout/pub/orderForm', {
      method: 'POST',
      credentials: 'include'
    }).then((res) => res.json());
  },
  setOrderForm: (ofid = '', attachID = '', data) => {
    return fetch(`/api/checkout/pub/orderForm/${ofid}/attachments/${attachID}`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        expectedOrderFormSections,
        ...data
      }),
      headers: {
        'content-type': 'application/json'
      }
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  }
};
