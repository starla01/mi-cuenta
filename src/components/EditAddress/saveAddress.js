import { fetchGraph } from '../../misc';

export default ({ id, type, openTextField }) => {
  return fetchGraph({
    query: `mutation saveAddress(
      $id: String
      $type: String
      $openTextField: String
    ) {
      address(id: $id, type: $type, openTextField: $openTextField) {
        id
        type
        openTextField
      }
    }`,
    variables: { id, type, openTextField }
  });
};
