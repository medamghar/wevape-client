import { gql } from '@apollo/client';

const COMPLETE_USER_MUTATION = gql`
  mutation CompleteUser(
    $name: String!, 
    $city: String!, 
    $raisonsocial: String!, 
    $adress: String!, 
    $latitude: String!, 
    $longitude: String!
  ) {
    completeUser(
      name: $name,
      city: $city,
      raisonsocial: $raisonsocial,
      adress: $adress,
      latitude: $latitude,
      longitude: $longitude
    ) {
      message
    }
  }
`;
export const LIKE_PRODUCT= gql`
mutation LikeProduct($productId: Float!) {
  likeProduct(productId: $productId) {
    message
    ok
  }
}


`

export default COMPLETE_USER_MUTATION;