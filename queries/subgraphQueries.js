import { gql, useQuery } from "@apollo/client"

export const GET_ACTIVE_ITEMS = gql`
    {
       activeItems(first: 5  where: { buyer: "0x0000000000000000000000000000000000000000" }) {
        id
        buyer
        seller
        nftAddress
        price
        tokenId
        transactionHash
        blockTimestamp
        blockNumber
      }
    }
`

