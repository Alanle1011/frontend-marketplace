import React, { useState } from "react"
import UploadNFT from "../components/uploadNFT/UploadNFT"
import { ethers } from "ethers"
import nftMinterAbi from "../constants/NftMinter.json"
import { useMoralis, useWeb3Contract } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import { useNotification } from "web3uikit"

export default function UploadNftPage(){
    const dispatchNotification = useNotification();
    const { runContractFunction } = useWeb3Contract();
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ?? parseInt(chainId).toString()
    const minterAddress =  chainId ? networkMapping[chainString].NftMinter[0] : null
    const [cid, setCid] = useState("");
    const [jsonCid, setJsonCid] = useState("");
    const [uploading, setUploading] = useState(false);


    const uploadToIPFS = async (fileImg) => {

        if (fileImg) {
            try {
                setUploading(true);
                const formData = new FormData();
                formData.append("file", fileImg, { filename: fileImg.name });
                const res = await fetch("/api/upload-image", {
                    method: "POST",
                    body: formData,
                });
                const ipfsHash = await res.text();
                setCid(ipfsHash);
                setUploading(false);
            } catch (e) {
                console.log(e);
                setUploading(false);
                alert("Trouble uploading file");
            }
        }
    }

    const uploadJSONToIPFS = async (image, name, description) => {
        if (image && name && description) {
            try {
                setUploading(true);

                //make metadata
                const metadata = {};
                metadata.name = name;
                metadata.image = `ipfs://${cid}`;
                metadata.description = description;
                metadata.attributes = [];

                const res = await fetch("/api/upload-json-metadata", {
                    method: "POST",
                    body: JSON.stringify(metadata),
                });
                const ipfsHash = await res.text();
                setJsonCid(ipfsHash)
                setUploading(false);
            } catch (e) {
                console.log(e);
                setUploading(false);
                alert("Trouble uploading JSON");
            }
        }
        if(jsonCid){
            createNft(jsonCid)
        }
    }

    async function createNft(uri) {
        debugger
        const mintOptions = {
            abi: nftMinterAbi,
            contractAddress: minterAddress,
            functionName: "safeMint",
            params: {
                uri: `ipfs://${uri}`,
            },
        }

        await runContractFunction({
            params: mintOptions,
            onSuccess: () => handleMintSuccess(),
            onError: (error) => console.log(error),
        })
    }

    const handleMintSuccess = () => {
        dispatchNotification({
            type: "success",
            message: "Mint Nft proceeds",
            position: "topR",
        })
    }
    return (
        <div className={'px-14'}>
            <h1 className="py-4 px-4 font-bold text-3xl">Create new NFT</h1>
            <p>You can set preferred display name, create your profile URL and manage other personal settings.</p>
            <h2 className="py-4 px-4 font-bold text-2xl">Image, Video, Audio, or 3D Model</h2>
            <UploadNFT uploadToIPFS={uploadToIPFS} uploadJSONToIPFS={uploadJSONToIPFS} uploading={uploading} cid={cid}/>

        </div>
    )
}