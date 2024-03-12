import { useEffect, useState } from "react"
import {FaPercent} from "react-icons/fa"
import DropZone from "./dropzone/DropZone"
import pubImage from "/public/pug.png"
import { Button } from "web3uikit"
import { useRouter } from "next/router"
import { TraitInput, TraitList } from "../TraitComponent"

const UploadNFT= ({uploadToIPFS, uploadJSONToIPFS, uploading, cid})=>{
    const router = useRouter()

    const [active, setActive] = useState(0);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(0);
    const [image, setImage] = useState(null);
    const [traits, setTraits] = useState([]);
    const handleAddTrait = (newTrait) => {
        setTraits([...traits, newTrait]);
    };
    useEffect(()=>{
        if(cid){
            setImage(`https://ipfs.io/ipfs/${cid}`);
        }
    })

    return (
        <div className='flex gap-10'>
            <div className="w-1/2">
                <DropZone title={"JPG, PNG, WEBM, GIF MAX 50MB"}
                          heading={'Drag & drop file'}
                          subHeading={"or Browse media on your device"}
                          name={name}
                          description={description}
                          category={category}
                          image={image}
                          setImage={setImage}
                          uploadToIPFS={uploadToIPFS}
                          uploading={uploading}
                />
            </div>

            <div className='flex flex-col w-1/2 gap-8'>
                <div className='w-full flex flex-col gap-2'>
                    <p className="text-2xl font-bold">Name *</p>
                    <input type={"text"} placeholder={"Name Your NFT"}
                           className="rounded text-xl p-4 border border-black w-full"
                           onChange={(e) => setName(e.target.value)} />
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <p className="text-2xl font-bold">Description *</p>
                    <textarea rows="5" className="rounded text-xl p-4 border border-black w-full"
                              onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <p className="text-2xl font-bold">Trait</p>
                    <TraitList traits={traits} />
                    <TraitInput onAddTrait={handleAddTrait} />
                </div>
                <div>
                    <Button onClick={() => uploadJSONToIPFS(image, name, description, traits)}>
                        Upload
                    </Button>
                </div>
            </div>
        </div>
    )
}
export default UploadNFT;