import { gql, useQuery } from "@apollo/client"

export const GET_ACTIVE_LISTED_ITEMS = gql`
    {
       activeItems(where: { buyer: "0x0000000000000000000000000000000000000000", isBidding: false }, orderBy: blockTimestamp, orderDirection: desc) {
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
export const GET_ACTIVE_BIDDING_ITEMS = gql`
    {
      activeItems(where: { buyer_not: "0x000000000000000000000000000000000000dEaD", isBidding: true, isFinishedBidding:false }, orderBy: blockTimestamp, orderDirection: desc) {
            id
            buyer
            seller
            nftAddress
            price
            tokenId
            isBidding
            endTime
            isFinishedBidding
            transactionHash
            blockTimestamp
            blockNumber
      }
    }
`

export const GET_LISTED_ITEMS_BY_ADDRESS  =(address)=> gql`
    {
       activeItems(first: 5  where: { seller: "${address}", buyer_not: "0x000000000000000000000000000000000000dEaD", isFinishedBidding: false  }) {
        id
        buyer
        seller
        nftAddress
        price
        tokenId
        isBidding
        isFinishedBidding
        transactionHash
        blockTimestamp
        blockNumber
       }
    }
`

export const GET_LISTED_ITEM_BY_ADDRESS_TOKENID  =(address, tokenId)=> gql`
    {
       activeItems(first: 1  where: { nftAddress: "${address}",tokenId: "${tokenId}" }) {
        id
        buyer
        seller
        nftAddress
        price
        tokenId
        isBidding
        isFinishedBidding
        endTime
        transactionHash
        blockTimestamp
        blockNumber
       }
    }
`
export const GET_PREVIOUS_TRANSACTION = (address, tokenId)=> gql`
{
    raiseBidPrices(first: 20, where:{nftAddress: "${address}", tokenId: "${tokenId}"})  {
        id
        nftAddress
        tokenId
        buyer
        price
        endTime
        transactionHash
        blockTimestamp
  }     
}
`

