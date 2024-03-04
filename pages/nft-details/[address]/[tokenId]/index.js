import React, { useEffect } from "react"
import { useRouter } from 'next/router'
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import {useState} from "react"
import nftAbi from "../../../../constants/BasicNft.json"
import Image from "next/image"
import Link from "next/link"
import { truncateStr } from "../../../../utils/string"

const Details = () => {
    const router = useRouter()
    const {address, tokenId} = router.query;
    const { isWeb3Enabled, account, chainId } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [tokenAttributes, setTokenAttributes] = useState()
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const dispatchNotification = useNotification()
    const [nft, setNft] = useState()
    const [nftOwner, setNftOwner] = useState("")

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: address,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId
        }
    })

    const BASE_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/cG8GOT4HrTWOuGF8guWUq7JtQyJfY7H2"
    const GET_NFT_URL = `${BASE_URL}/getNFTMetadata/?contractAddress=${address}&tokenId=${tokenId}&refreshCache=false`
    const GET_NFT_OWNER_URL = `${BASE_URL}/getOwnersForToken/?contractAddress=${address}&tokenId=${tokenId}`

    var requestOptions = {
        method: "get",
        redirect: "follow"
    }
    const getNFT = () => {
        fetch(GET_NFT_URL, requestOptions)
            .then(response => response.json())
            .then(response => {
                setNft(response);
            })
            .catch(error => console.log("error", error))
    }
    const getNFTOwner = () => {
        fetch(GET_NFT_OWNER_URL, requestOptions)
            .then(response => response.json())
            .then(response => {
                setNftOwner(response.owners[0]);
            })
            .catch(error => console.log("error", error))
    }
    console.log('nft', nft)
    async function updateUI() {
        if(address && tokenId){
            let tokenURI = await getTokenURI()
            console.log(`The TokenURI is ${tokenURI}`)
            if (!tokenURI.includes("ipfs://")) {
                tokenURI = "ipfs://" + tokenURI;
            }
            if (tokenURI) {
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
                setTokenAttributes(tokenURIResponse.attributes)
            }
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
            getNFT();
            getNFTOwner();
        }
    }, [isWeb3Enabled])

    if(!imageURI){
        return (
            <div className={'m-5 w-full h-full flex justify-center items-center'}>
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
        )
    }

    return (
        <div className="w-full m-5">
            <div className='flex gap-6'>
                <div className="border border-gray-500 w-fit rounded-2xl">
                    <div
                        className=" px-5 flex items-center justify-between border-gray-500 bg-blue-300 h-10 rounded-t-2xl">
                        <div className='flex items-center'>
                            <Image height="20"
                                   width="20" src='/eth-icon.svg'
                                   alt={"ethIcon"} />
                            <p className='font-medium'>Sepolia testnet</p>
                        </div>

                        <a href={imageURI || null} target="_blank" rel="noreferrer">
                            <Image height="20"
                                   width="20" src='/share-icon.png'
                                   alt={"shareIcon"}
                            />
                        </a>
                    </div>
                    <div className='p-10'>
                        <Image
                            loader={() => imageURI}
                            src={imageURI}
                            height="500"
                            width="500"
                            alt={"nftImage"} />
                    </div>
                </div>
                <div>
                    <h1 className="font-bold text-2xl">{tokenName} #{tokenId}</h1>
                    <a href={`https://sepolia.etherscan.io/address/${nftOwner}`} target="_blank" rel="noreferrer">
                        <p>Owned by <span className="text-blue-500">{truncateStr(nftOwner, 12) || null}</span></p>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Details
