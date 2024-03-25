import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import nftAbi from "../../../../constants/BasicNft.json"
import Image from "next/image"
import { formatDate, truncateStr } from "../../../../utils/string"
import nftMarketplaceAbi from "../../../../constants/NftMarketPlace.json"
import networkMapping from "../../../../constants/networkMapping.json"
import { useQuery } from "@apollo/client"
import {
    GET_LISTED_ITEM_BY_ADDRESS_TOKENID,
    GET_PREVIOUS_TRANSACTION,
} from "../../../../queries/subgraphQueries"
import { ethers } from "ethers"
import ListingModal from "../../../../components/ListingModal"
import BidingModal from "../../../../components/BidingModal"

const Details = () => {
    const router = useRouter()
    const { address, tokenId } = router.query
    const { isWeb3Enabled, account, chainId } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [tokenAttributes, setTokenAttributes] = useState([])
    const chainString = chainId ?? parseInt(chainId).toString()
    const marketplaceAddress = chainString
        ? networkMapping[chainString].NftMarketPlace[0]
        : null
    const { data } = useQuery(
        GET_LISTED_ITEM_BY_ADDRESS_TOKENID(address, tokenId), { context: {clientName: chainId}}
    )
    const { data: dataBid } = useQuery(
        GET_PREVIOUS_TRANSACTION(address, tokenId), { context: {clientName: chainId}}
    )
    const [listedNft, setListedNft] = useState()
    const [previousBidding, setPreviousBidding] = useState([])
    const dispatchNotification = useNotification()
    const [nft, setNft] = useState()
    const [nftOwner, setNftOwner] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [showBidModal, setShowBidModal] = useState(false)
    const { isLoading } = useWeb3Contract()
    const currentTime = Date.now() / 1000

    const BASE_URL =
        chainId === "0x66eee"
            ? process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL
            : process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
    const GET_NFT_URL = `${BASE_URL}/getNFTMetadata/?contractAddress=${address}&tokenId=${tokenId}&refreshCache=false`
    const GET_NFT_OWNER_URL = `${BASE_URL}/getOwnersForToken/?contractAddress=${address}&tokenId=${tokenId}`

    // CONTRACT INTERACTIONS
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: address,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })
    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: listedNft?.price,
        params: {
            nftAddress: address,
            tokenId: tokenId,
        },
    })
    const { runContractFunction: buyBidItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyBidItem",
        msgValue: listedNft?.price,
        params: {
            nftAddress: address,
            tokenId: tokenId,
        },
    })

    const { runContractFunction: cancelListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "cancelListing",
        params: {
            nftAddress: address,
            tokenId: tokenId,
        },
    })
    const { runContractFunction: cancelBidding } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "cancelBidding",
        params: {
            nftAddress: address,
            tokenId: tokenId,
        },
    })

    //FE function
    var requestOptions = {
        method: "get",
        redirect: "follow",
    }
    const getNFT = () => {
        fetch(GET_NFT_URL, requestOptions)
            .then((response) => response.json())
            .then((response) => {
                setNft(response)
            })
            .catch((error) => console.log("error", error))
    }
    const getNFTOwner = () => {
        fetch(GET_NFT_OWNER_URL, requestOptions)
            .then((response) => response.json())
            .then((response) => {
                setNftOwner(response.owners[0])
            })
            .catch((error) => console.log("error", error))
    }
    const handleBuyNft = () => {
        if (account !== nftOwner && listedNft) {
            buyItem({
                onError: (error) => console.log(error),
                onSuccess: () => handleBuyItemSuccess(),
            })
        }
    }
    const handleBuyBidNft = () => {
        if (
            account !== nftOwner &&
            listedNft &&
            listedNft.endTime < currentTime
        ) {
            buyBidItem({
                onError: (error) => console.log(error),
                onSuccess: () => handleBuyItemSuccess(),
            })
        }
    }
    const handleCancelListing = () => {
        if (account === nftOwner && listedNft) {
            if (listedNft.isBidding) {
                cancelBidding({
                    onError: (error) => console.log(error),
                    onSuccess: () => handleCancelListingSuccess(),
                })
            } else {
                cancelListing({
                    onError: (error) => console.log(error),
                    onSuccess: () => handleCancelListingSuccess(),
                })
            }
        }
    }

    async function updateUI() {
        if (address && tokenId) {
            let tokenURI = await getTokenURI()
            console.log(`The TokenURI is ${tokenURI}`)
            if (!tokenURI.includes("ipfs://")) {
                tokenURI = "ipfs://" + tokenURI
            }
            if (tokenURI) {
                const requestURL = tokenURI.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                )
                const tokenURIResponse = await (await fetch(requestURL)).json()
                const imageURI = tokenURIResponse.image
                const imageURIURL = imageURI.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                )
                setImageURI(imageURIURL)
                setTokenName(tokenURIResponse.name)
                setTokenDescription(tokenURIResponse.description)
                setTokenAttributes(tokenURIResponse.attributes)
            }
        }
    }

    // Notifications
    const handleCancelListingSuccess = () => {
        dispatchNotification({
            type: "warning",
            message: "Item Cancel!",
            title: "Item Cancel",
            position: "topR",
        })
        setTimeout(() => {
            window.location.reload()
        }, 5000)
    }
    const handleBuyItemSuccess = () => {
        dispatchNotification({
            type: "warning",
            message: "Item Buying!",
            title: "Item Buying",
            position: "topR",
        })
        setTimeout(() => {
            window.location.reload()
        }, 5000)
    }

    // Use Effect
    useEffect(() => {
        if (data) {
            setListedNft(data.activeItems[0])
        }
        if (dataBid) {
            setPreviousBidding(dataBid.raiseBidPrices)
        }
    }, [data, dataBid])

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
            getNFT()
            getNFTOwner()
        }
    }, [isWeb3Enabled, account])

    if (!imageURI && !listedNft) {
        return (
            <div
                className={"m-5 w-full h-full flex justify-center items-center"}
            >
                <svg
                    aria-hidden="true"
                    className="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                    />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                    />
                </svg>
            </div>
        )
    }
    return (
        <div className="w-full p-5 px-28">
            <div className="flex gap-6">
                <div className="flex flex-col gap-2">
                    <div className="border border-gray-500 w-fit rounded-2xl">
                        <div className=" px-5 flex items-center justify-between border-gray-500 bg-blue-300 h-10 rounded-t-2xl">
                            <div className="flex items-center">
                                <Image
                                    height="20"
                                    width="20"
                                    src="/eth-icon.svg"
                                    alt={"ethIcon"}
                                />
                                <p className="font-medium">Sepolia testnet</p>
                            </div>

                            <a
                                href={imageURI || null}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Image
                                    height="20"
                                    width="20"
                                    src="/share-icon.png"
                                    alt={"shareIcon"}
                                />
                            </a>
                        </div>
                        <div className="p-10">
                            <Image
                                loader={() => imageURI}
                                src={imageURI || "/share-icon.png"}
                                height="1000"
                                width="1000"
                                alt={"nftImage"}
                            />
                        </div>
                    </div>
                    <div className="border border-gray-500 w-full rounded-2xl p-4">
                        <h1 className="text-2xl font-bold py-2">Description</h1>
                        {tokenDescription ? (
                            <p>{tokenDescription}</p>
                        ) : (
                            <p className="flex items-center justify-center p-4 font-bold text-lg">
                                There are no Description
                            </p>
                        )}
                    </div>
                </div>
                <div className="w-full flex flex-col gap-4">
                    <h1 className=" font-bold text-4xl">
                        {tokenName} #{tokenId}
                    </h1>
                    <a
                        href={`https://sepolia.etherscan.io/address/${nftOwner}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <p>
                            Owned by{" "}
                            <span className="text-lg text-blue-500">
                                {truncateStr(nftOwner, 12) || null}
                            </span>
                        </p>
                    </a>
                    {!!listedNft && listedNft.isFinishedBidding === false ? (
                        <div className="border-gray-500 border bg-blue-100 rounded-lg w-full p-5 mt-5">
                            <div className="flex justify-between">
                                <div>
                                    <p>Current Price</p>
                                    <p className="text-4xl font-bold">
                                        {ethers.utils.formatUnits(
                                            listedNft ? listedNft?.price : 0,
                                            "ether"
                                        )}{" "}
                                        ETH
                                    </p>
                                </div>
                                <div>
                                    <p className="text-end">Highest Bidder</p>
                                    <p className="text-lg font-medium text-end">
                                        {listedNft?.buyer ===
                                        "0x0000000000000000000000000000000000000000"
                                            ? "-"
                                            : truncateStr(listedNft?.buyer, 15)}
                                    </p>
                                    <p className="text-end">End Time</p>
                                    <p className="text-lg font-medium text-end">
                                        {listedNft?.endTime === "0"
                                            ? "-"
                                            : formatDate(listedNft.endTime)}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full flex gap-5 mt-10">
                                {listedNft?.seller === account ? (
                                    <button
                                        className="w-full bg-red-400 rounded-lg p-3 text-xl font-bold hover:bg-red-500"
                                        disabled={isLoading}
                                        onClick={() => handleCancelListing()}
                                    >
                                        Cancel Listing
                                    </button>
                                ) : listedNft?.isBidding === false ? (
                                    <button
                                        className="w-full bg-blue-400 rounded-lg p-3 text-xl font-bold hover:bg-blue-500"
                                        disabled={isLoading}
                                        onClick={() => handleBuyNft()}
                                    >
                                        Buy Now
                                    </button>
                                ) : listedNft?.endTime > currentTime ||
                                  listedNft?.endTime === "0" ? (
                                    <button
                                        className="w-full border-orange-400 border-2 rounded-lg p-3 text-xl font-bold text-orange-400 hover:bg-orange-100"
                                        disabled={isLoading}
                                        onClick={() => setShowBidModal(true)}
                                    >
                                        Place Bid
                                    </button>
                                ) : listedNft.buyer === account ? (
                                    <button
                                        className="w-full bg-blue-400 rounded-lg p-3 text-xl font-bold hover:bg-blue-500"
                                        disabled={
                                            isLoading ||
                                            listedNft.buyer !== account
                                        }
                                        onClick={() => handleBuyBidNft()}
                                    >
                                        Buy Bid
                                    </button>
                                ) : (
                                    <button
                                        className="w-full bg-gray-400 rounded-lg p-3 text-xl font-bold "
                                        disabled={
                                            isLoading ||
                                            listedNft.buyer !== account
                                        }
                                        onClick={() => handleBuyBidNft()}
                                    >
                                        Not the highest bidder
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="border-gray-500 border bg-blue-100 rounded-lg w-full p-5 mt-5">
                            <p>Previous Price</p>
                            <p className="text-4xl font-bold">
                                {ethers.utils.formatUnits(
                                    listedNft ? listedNft?.price : 0,
                                    "ether"
                                )}{" "}
                                ETH
                            </p>
                            <div className="w-full flex gap-5 mt-10">
                                <button
                                    className="w-full bg-blue-400 rounded-lg p-3 text-xl font-bold hover:bg-blue-500"
                                    onClick={() => setShowModal(true)}
                                >
                                    List Now
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="rounded-lg bg-blue-100 border-gray-500 border p-2">
                        <h1 className="text-2xl font-bold p-2">Transaction</h1>
                        {listedNft?.isBidding === true &&
                        previousBidding.length > 0 ? (
                            <table className="w-full">
                                <thead className="border-b border-gray-500 w-full">
                                    <tr className="flex w-full mb-4">
                                        <th className="p-4 w-1/6">
                                            Transaction
                                        </th>
                                        <th className="p-4 w-1/6">Buyer</th>
                                        <th className="p-4 w-1/6">Price</th>
                                        <th className="p-4 w-1/6">Time</th>
                                        <th className="p-4 w-1/6">End Time</th>
                                        <th className="p-4 w-1/6">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-grey-light flex flex-col items-center justify-between overflow-y-scroll roll w-full h-[400px]">
                                    {[...previousBidding]
                                        .sort(
                                            (a, b) =>
                                                b.blockTimestamp -
                                                a.blockTimestamp
                                        )
                                        .map((bid, key) => (
                                            <tr
                                                key={key}
                                                className=" w-full mb-4"
                                            >
                                                <td className={"p-4 w-1/6"}>
                                                    <p className="text-center">
                                                        {truncateStr(
                                                            bid.transactionHash,
                                                            10
                                                        )}
                                                    </p>
                                                </td>
                                                <td className={"p-4 w-1/6"}>
                                                    <p className="text-center">
                                                        {truncateStr(
                                                            bid.buyer,
                                                            10
                                                        )}
                                                    </p>
                                                </td>
                                                <td className={"p-4 w-1/6"}>
                                                    <p className="text-center">
                                                        {ethers.utils.formatUnits(
                                                            bid.price,
                                                            "ether"
                                                        )}{" "}
                                                        ETH
                                                    </p>
                                                </td>
                                                <td className={"p-4 w-1/6"}>
                                                    <p className="text-center">
                                                        {formatDate(
                                                            bid.blockTimestamp
                                                        )}
                                                    </p>
                                                </td>
                                                <td className={"p-4 w-1/6"}>
                                                    <p className="text-center">
                                                        {formatDate(
                                                            bid.endTime
                                                        )}
                                                    </p>
                                                </td>
                                                <td className={"p-4 w-1/6"}>
                                                    <p className="text-center">
                                                        Raise Price
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="w-full items-center justify-center my-4 text-center text-lg font-bold">
                                <p>There Are no Bidding yet</p>
                            </div>
                        )}
                    </div>

                    <div className="border-gray-500 border bg-blue-100 rounded-lg w-full p-5">
                        <p className="text-2xl font-bold">Trait</p>
                        <div className="my-4 h-[1px] w-full bg-black"></div>
                        {tokenAttributes.length ? (
                            <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-x-2 gap-y-4">
                                {tokenAttributes.map((attribute, key) => {
                                    return (
                                        <div
                                            key={key}
                                            className="flex cursor-pointer items-center justify-between rounded
                                        border border-gray-500 px-4 py-2 hover:border-black hover:bg-blue-300"
                                        >
                                            <div className="flex h-full flex-col justify-between text-sm">
                                                <p className="text-grays">
                                                    {attribute.trait_type}
                                                </p>
                                                <p className="mt-1">
                                                    {attribute.value}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="flex justify-center items-center w-full">
                                <p className="text-2xl font-bold">
                                    No traits Available
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ListingModal
                isVisible={showModal}
                tokenId={tokenId}
                marketplaceAddress={marketplaceAddress}
                nftAddress={address}
                onClose={() => setShowModal(false)}
            />
            <BidingModal
                isVisible={showBidModal}
                tokenId={tokenId}
                marketplaceAddress={marketplaceAddress}
                nftAddress={address}
                onClose={() => setShowBidModal(false)}
            />
        </div>
    )
}

export default Details
