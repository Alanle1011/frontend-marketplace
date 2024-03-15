import { useEffect, useState } from "react"
import {FaPercent} from "react-icons/fa"
import DropZone from "./dropzone/DropZone"
import pubImage from "/public/pug.png"
import { Button } from "web3uikit"
import { useRouter } from "next/router"
import { TraitInput, TraitList, TraitModal } from "../TraitComponent"

const UploadNFT= ({uploadToIPFS, uploadJSONToIPFS, uploading, cid})=>{
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(0);
    const [image, setImage] = useState(null);
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [traits, setTraits] = useState([{}]);
    const [editTrait, setEditTrait] = useState(null);

    const handleAddTrait = (newTrait) => {
        setTraits([...traits, newTrait]);
    };
    const handleDeleteTrait = (index) => {
        const newData = [...traits]; // Create a copy of the array
        newData.splice(index, 1); // Remove the object at the specified index
        setTraits(newData);
    }
    const handleOpenEditModal = (trait, index)=>{
        setIsVisibleModal(true);
        setEditTrait({...trait, index});
    }
    const handleEditTrait = (trait, index) => {
        const newData = [...traits]; // Create a copy of the array
        newData.splice(index, 1);
        newData.push(trait)// Remove the object at the specified index
        setTraits(newData);
    }
    useEffect(()=>{
        if(cid){
            setImage(`https://ipfs.io/ipfs/${cid}`);
        }
    },[cid])

    return (
        <div className='flex gap-8'>
            <div className="">
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

            <div className='flex flex-col  flex-1 gap-8'>
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
                    <TraitList traits={traits} handleEditTrait={handleOpenEditModal} handleDeleteTrait={handleDeleteTrait} />
                    <button onClick={()=>{setIsVisibleModal(true); setEditTrait(null)}}>Add Trait</button>
                </div>
                <div>
                    <Button onClick={() => uploadJSONToIPFS(image, name, description, traits)}>
                        Upload
                    </Button>
                </div>
            </div>
            <TraitModal onDeleteTrait={handleDeleteTrait} onEditTrait={handleEditTrait} editTrait={editTrait || null}  onClose={()=>{setIsVisibleModal(false); setEditTrait(null)}} isVisible={isVisibleModal} onAddTrait={handleAddTrait}/>
        </div>
    )
}
export default UploadNFT;