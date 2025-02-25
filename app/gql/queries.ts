import { gql } from '@apollo/client';

export const GET_COLLECTIONS_QUERY = gql`
  query {
    getCollection {
      id
      name
      photo
    }
  }
`;

export const GET_LIKEDPRODUCT_QUERY = gql`
  query {
    getLikedProducts {
     id
      id
          name
          price
          photos {
            url
          }
    }
  }
`;
export  const GET_PRODUCT_BY_ID = gql`
query getProductById($productId: Float!) {
  getProductById(productId: $productId) {
    id
    price
    description
    name
    variants {
      id
      name
      photo
      quantityInStock
    }
    photos {
      id
      url
    }
  }
}
`;


export const GET_COLLECTION = gql`
  query getCollectionById($id: Float!, $cursor: Int, $take: Int) {
    getCollectionById(id: $id, cursor: $cursor, take: $take) {
      collection {
        id
        name
        products {
          id
          name
          price
          photos {
            url
          }
        }
      }
      nextCursor
    }
  }
`;
export const GET_MARKS_BY_ID = gql`
  query getMarkId($id: Float!, $cursor: Int, $take: Int) {
    getMarkId(id: $id, cursor: $cursor, take: $take) {
      mark {
        id
        name
        products {
          id
          name
          price
          photos {
            url
          }
        }
      }
      nextCursor
    }
  }
`;
export const SEARCH_PRODUCTS = gql`
  query searchProduct($input: String, $cursor: Int, $take: Int) {
    searchProduct(input: $input, cursor: $cursor, take: $take) {
        products {
          id
          name
          price
          photos {
            url
          }
        }
      
      nextCursor
    }
  }
`;
export const GET_ORDERS = gql`
 query{getOrders{id totalAmount createdAt status orderProducts{quantity}}}
`;

export const GET_USER = gql`
query{getUser{id name RaisonSocial phoneNumber  location{latitude longitude address city }}}`;

export const GET_VERIFIED = gql`
query{isVerified{ok message userFound}}`;


export const GET_MARKS =gql`query{getMarks{id name photo}}`

export const GET_PROMOTION =gql`query{getPromorionsHeader{ id title description startDate endDate isActive product{id}}}`

export const GET_TOP =gql`query{
getTop{
collections{
id 
name 
photo}
marks{
id 
name 
photo 
}
products
{
 id
          name
          price
          photos {
            url
          }

}}}`
