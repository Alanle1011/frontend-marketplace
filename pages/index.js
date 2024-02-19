import { useMoralisQuery, useMoralis, useChain } from "react-moralis"
import NFTBox from "../components/NFTBox"
import networkMapping from "../constants/networkMapping.json"
import {GET_ACTIVE_ITEMS} from "../queries/subgraphQueries"
import { useQuery } from "@apollo/client"
import { useEffect } from "react"

export default function Home() {
    const { chainId, isWeb3Enabled, Moralis } = useMoralis()
    const { switchNetwork } = useChain()
    const chainString = chainId ?? parseInt(chainId).toString()
    const marketplaceAddress = chainId === "0xaa36a7" ? networkMapping[chainString].NftMarketPlace[0].toString() : null
    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)
    console.log(listedNfts)
    useEffect(() => {
        async function changeNetwork() {
            if (window.confirm("You're on the wrong network! Click OK to switch to Sepolia chain!")) {
                await Moralis.enableWeb3()
                await switchNetwork("0xaa36a7")
                window.location.reload();
            } else {
                alert("You're on the wrong network & will result in loss of funds due to failed transaction! Switch to Sepolia chain manually in your Metamask Wallet!")
            }
        }

        if (!!chainId && chainId !== "0xaa36a7") {
            changeNetwork()
        }
    }, [isWeb3Enabled, chainId])

    return (
        <div className="container mx-2">
            <h1 className="p-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap gap-3 p-4 ">

                {isWeb3Enabled && chainId === "0xaa36a7" ? (
                    loading || !listedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            const { price, nftAddress, tokenId, seller } = nft
                            return (
                                <NFTBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled or Wrong chain Sepolia</div>
                )}
            </div>
        </div>
    )
}
