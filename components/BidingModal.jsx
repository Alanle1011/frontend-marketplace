import { Modal, Input, useNotification, Checkbox } from "web3uikit"
import { useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketPlace.json"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"

export default function BidingModal({ nftAddress, tokenId, isVisible, marketplaceAddress, onClose }) {
    const dispatchNotification = useNotification()
    const { isLoading } = useWeb3Contract()
    const [priceToRaiseWith, setPriceToRaiseWith] = useState(0)

    const { runContractFunction: raiseBidPrice } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "raiseBidPrice",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            price: ethers.utils.parseEther(priceToRaiseWith || "0")
        }
    })

    const handleRaiseBid = () => {
        raiseBidPrice({
            onError: (error) => console.log(error),
            onSuccess: () => handleRaisePriceSuccess()
        })
    }
    //Notifications
    const handleRaisePriceSuccess = () => {
        dispatchNotification({
            type: "warning",
            message: "Item Biding!",
            title: "Item Biding",
            position: "topR"
        })
        setTimeout(() => {
            window.location.reload()
        }, 5000)
    }
    return (
        <Modal
            title={"Listing Price"}
            isVisible={isVisible}
            onCancel={!isLoading && onClose}
            onCloseButtonPressed={!isLoading && onClose}
            onOk={() => {
                handleRaiseBid()
            }}
            width={"30vw"}
            isCentered={true}
        >
            <div className="mb-10 w-full flex flex-col gap-2">
                <Input width={"100%"}
                       label="Listing price in L1 Currency (ETH)"
                       name="New listing price"
                       type="number"
                       onChange={(event) => {
                           setPriceToRaiseWith(event.target.value)
                       }}
                />
            </div>
        </Modal>
    )
}
