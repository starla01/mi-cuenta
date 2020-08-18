export default (body = {}) => {
  return fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT, {
    mode: 'cors',
    method: 'POST',
    credentials: 'omit',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(body)
  }).then((r) => r.json());
};
