import { Modal, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketPlace.json"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"

export default function SellModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
}) {
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract();
    const [priceToSellWith, setPriceToSellWith] = useState(0)

    const approveAndList = async (nftAddress, tokenId, price) => {
        console.log("Approving...")

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId
            }
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: (tx) =>
                handleApproveSuccess(tx, nftAddress, tokenId, price),
            onError: (error) => {
                console.log(error)
            }
        })
    }
    const handleApproveSuccess= async (tx, nftAddress, tokenId, price) => {
        console.log("Ok! Now time to list")
        await tx.wait(1)
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: ethers.utils.parseEther(price || "0")
            }
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: (tx) => handleListingSuccess(tx),
            onError: (error) => console.log(error)
        })
    }

    //Notifications
    const handleListingSuccess = async (tx) => {
        await tx.wait(1);

        dispatch({
            type: "success",
            message: "listing updated",
            title: "Listing updated - please refresh (and move blocks)",
            position: "topR",
        })
        onClose && onClose()
        setPriceToSellWith("0")
    }

    // const { runContractFunction: cancelListing } = useWeb3Contract({
    //     abi: nftMarketplaceAbi,
    //     contractAddress: marketplaceAddress,
    //     functionName: "cancelListing",
    //     params: {
    //         nftAddress: nftAddress,
    //         tokenId: tokenId,
    //     },
    // })

    return (
        <Modal
            title={"Listing Price"}
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                approveAndList(nftAddress, tokenId, priceToSellWith)
            }}
            o
        >
            <div className="w-[50vw] mb-10">
                <Input
                    label="Listing price in L1 Currency (ETH)"
                    name="New listing price"
                    type="number"
                    onChange={(event) => {
                        setPriceToSellWith(event.target.value)
                    }}
                />
            </div>
        </Modal>
    )
}
