import { fetchGraph } from '../../misc';
export default (postalCode) => {
  return fetchGraph({
    query: `query logistics($postalCode: String) {
      viewer {
        neighborhoods(postalCode: $postalCode) {
          id
          name
          state
          city
        }
      }
    }`,
    variables: { postalCode }
  }).then((res) => {
    let neighborhoods;
    try {
      neighborhoods = res.data.viewer.neighborhoods;
    } catch (e) {
      neighborhoods = [];
    }
    return neighborhoods;
  });
};
