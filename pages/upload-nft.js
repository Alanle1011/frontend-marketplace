import React, { useState } from "react"
import UploadNFT from "../components/uploadNFT/UploadNFT"

export default function UploadNftPage(){

    const [cid, setCid] = useState("");
    const [uploading, setUploading] = useState(false);
    const uploadToIPFS = async (fileImg) => {
        if (fileImg) {
            try {
                setUploading(true);
                const formData = new FormData();
                formData.append("file", fileImg, { filename: fileImg.name });
                const res = await fetch("/api/files", {
                    method: "POST",
                    body: formData,
                });
                const ipfsHash = await res.text();
                debugger
                setCid(ipfsHash);
                setUploading(false);
            } catch (e) {
                console.log(e);
                setUploading(false);
                alert("Trouble uploading file");
            }
        }
    }
    return (
        <div className={'px-14'}>
            <h1 className="py-4 px-4 font-bold text-3xl">Create new NFT</h1>
            <p>You can set preferred display name, create your profile URL and manage other personal settings.</p>
            <h2 className="py-4 px-4 font-bold text-2xl">Image, Video, Audio, or 3D Model</h2>
            <UploadNFT uploadToIPFS={uploadToIPFS} uploading={uploading} cid={cid}/>

        </div>
    )
}