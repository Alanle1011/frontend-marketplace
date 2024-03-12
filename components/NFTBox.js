import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketPlace.json"
import nftAbi from "../constants/BasicNft.json"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"
import { truncateStr } from "../utils/string"
import Image from "next/image"

import Link from "next/link"
export default function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { isWeb3Enabled, account, chainId } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const dispatchNotification = useNotification()
    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser
        ? "you"
        : truncateStr(seller || "", 15)


    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId
        }
    })


    async function updateUI() {
        let tokenURI = await getTokenURI()
        console.log(`The TokenURI is ${tokenURI}`)
        if (!tokenURI.includes("ipfs://")) {
            tokenURI = "ipfs://" + tokenURI;
        }
        if (tokenURI) {
            // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
            const requestURL = tokenURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
            )
            console.log(requestURL)
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
            )
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)

        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])



    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <UpdateListingModal
                            isVisible={showModal}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideModal}
                        />
                        <Link href={`/nft-details/${nftAddress}/${tokenId}`}>
                            <div>
                                <Card
                                    title={tokenName}
                                    description={tokenDescription}
                                >
                                    <div className="p-2">
                                        <div className="flex flex-col items-end gap-2">
                                            <div>#{tokenId}</div>
                                            <div className="italic text-sm">
                                                Owned by {formattedSellerAddress}
                                            </div>
                                            <Image
                                                loader={() => imageURI}
                                                src={imageURI}
                                                height="200"
                                                width="200"
                                                alt={"nftImage"} />
                                            <div className="font-bold">
                                                {ethers.utils.formatUnits(
                                                    price,
                                                    "ether"
                                                )}{" "}
                                                ETH
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Link>

                    </div>
                ) : (
                    <div>
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                        >
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div className="w-[200px] flex justify-center items-center h-[340px]" role="status">
                                        <svg aria-hidden="true"
                                             className="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor" />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
