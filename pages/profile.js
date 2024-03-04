import styles from "../styles/Home.module.css"
import { Form, useNotification, Button, Card } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"
import nftMarketplaceAbi from "../constants/NftMarketPlace.json"
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState } from "react"
import NFTBox from "../components/NFTBox"
import Image from "next/image"
import { hexToString, truncateStr } from "../utils/string"
import UpdateListingModal from "../components/UpdateListingModal"
import SellModal from "../components/SellModal"
import { useQuery } from "@apollo/client"
import { GET_ACTIVE_ITEMS, GET_LISTED_ITEMS_BY_ADDRESS } from "../queries/subgraphQueries"


export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ?? parseInt(chainId).toString()
    const marketplaceAddress = chainId ? networkMapping[chainString].NftMarketPlace[0] : null
    const dispatchNotification = useNotification()
    const [proceeds, setProceeds] = useState("0")
    const { runContractFunction } = useWeb3Contract()
    const [nftList, setNftList] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [tokenId, setTokenId] = useState()
    const [nftAddress, setNftAddress] = useState()

    //Get the NFT listed on Marketplace
    const { loading, error, data: listedNfts } = useQuery(GET_LISTED_ITEMS_BY_ADDRESS(account))

    //get all NFT by address
    const BASE_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/cG8GOT4HrTWOuGF8guWUq7JtQyJfY7H2"
    const ADDRESS = account
    const URL = `${BASE_URL}/getNFTs/?owner=${ADDRESS}`
    var requestOptions = {
        method: "get",
        redirect: "follow"
    }
    const getAllNFT = () => {
        fetch(URL, requestOptions)
            .then(response => response.json())
            .then(response => {
                const nfts = response


                setNftList(nfts["ownedNfts"])
            })
            .catch(error => console.log("error", error))
    }

    //Modal
    const handleCloseModal = () => setShowModal(false)
    const handleShowModal = (address, tokenId) => {
        setShowModal(true)
        setNftAddress(address)
        setTokenId(tokenId)

    }


    //Notification
    async function handleListSuccess() {
        dispatchNotification({
            type: "success",
            message: "NFT listing",
            title: "NFT listed",
            position: "topR"
        })
    }

    const handleWithdrawSuccess = () => {
        dispatchNotification({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR"
        })
    }

    async function setupUI() {
        const returnedProceeds = await runContractFunction({
            params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getProceeds",
                params: {
                    seller: account
                }
            },
            onError: (error) => console.log(error)
        })
        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString())
        }
    }

    useEffect(() => {
        setupUI()
        getAllNFT()
    }, [proceeds, account, isWeb3Enabled, chainId])

    return (
        <div className={styles.container}>
            <div>Withdraw {proceeds} proceeds</div>
            {proceeds != "0" ? (
                <Button
                    onClick={() => {
                        runContractFunction({
                            params: {
                                abi: nftMarketplaceAbi,
                                contractAddress: marketplaceAddress,
                                functionName: "withdrawProceeds",
                                params: {}
                            },
                            onError: (error) => console.log(error),
                            onSuccess: () => handleWithdrawSuccess
                        })
                    }}
                    text="Withdraw"
                    type="button"
                />
            ) : (
                <div>No proceeds detected</div>
            )}
            <div className="flex flex-wrap gap-3 p-4 ">

                {isWeb3Enabled && chainId === "0xaa36a7" ? (
                    !nftList ? (
                        <div className={"w-full h-full flex justify-center items-center"}>
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
                    ) : (
                        nftList.map((nft) => {
                            const imageURI = nft.metadata.image
                            const tokenId = parseInt(nft.id.tokenId, 16)
                            return (
                                <div key={nft.id}>
                                    <Card
                                        title={nft.title}
                                        description={nft.description}
                                        onClick={() =>
                                            handleShowModal(nft.contract.address, tokenId)
                                        }
                                    >
                                        <div className="p-2 w-fits">
                                            <div className="flex flex-col items-end gap-2">
                                                <div>#{tokenId}</div>
                                                <div className="italic text-sm">
                                                    Owned by {truncateStr(account, 12)}
                                                </div>
                                                <Image
                                                    loader={() => imageURI}
                                                    src={imageURI || "./favicon.ico"}
                                                    height="200"
                                                    width="200"
                                                    alt={"nftImage"} />
                                                {listedNfts?.activeItems.map((item, key) =>{
                                                    if(item.nftAddress === nft.contract.address && item.tokenId === `${tokenId}`) {
                                                        return (
                                                            <div key={key} className="flex flex-col items-end gap-2">
                                                                listed
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled or Wrong chain Sepolia</div>
                )}
            </div>


            <SellModal
                isVisible={showModal}
                tokenId={tokenId}
                marketplaceAddress={marketplaceAddress}
                nftAddress={nftAddress}
                onClose={handleCloseModal}
            />

        </div>
    )
}
