import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"

const DropZone = ({ title, heading, subHeading, name, website, description,image, filSide, category, setImage, uploadToIPFS, uploading }) => {

    const onDrop = useCallback(acceptedFiles => {
          uploadToIPFS(acceptedFiles[0]);
    })

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*",
        maxSize: 5000000000
    })

    return (
        <div >
            <div className={'border border-black rounded-lg'} {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <h2 className="text-2xl font-bold">{heading}</h2>
                    <h3 className="text-xl font-bold">{subHeading}</h3>
                </div>

            </div>
            {image && !uploading && (
                <aside>
                    <div>
                        <Image loader={() => image} height={"100px"} width={"100px"} src={image} objectFit={'contain'}/>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div>
                            <p>
                                <samp>NFT Name:</samp>
                                {name || ""}
                            </p>
                            <p>
                                <samp>Website:</samp>
                                {website || ""}
                            </p>
                        </div>
                        <div>
                            <p>
                                <samp>Description:</samp>
                                {description || ""}
                            </p>
                        </div>
                    </div>
                </aside>
            )}
        </div>
    )
}

export default DropZone