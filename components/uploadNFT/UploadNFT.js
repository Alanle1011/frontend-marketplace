import { useEffect, useState } from "react"
import {FaPercent} from "react-icons/fa"
import DropZone from "./dropzone/DropZone"
import pubImage from "/public/pug.png"
import { Button } from "web3uikit"
import { useRouter } from "next/router"

const UploadNFT= ({uploadToIPFS, uploading, cid})=>{
    const router = useRouter()

    const [active, setActive] = useState(0);
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [description, setDescription] = useState("");
    const [filSide, setFileSize] = useState("");
    const [category, setCategory] = useState(0);
    const [image, setImage] = useState(null);

    useEffect(()=>{
        if(cid){
            setImage(`https://ipfs.io/ipfs/${cid}`);
        }
    })

    return (
        <div>
            <DropZone title={"JPG, PNG, WEBM, MAX 100MB"}
                      heading={'Drag & drop file'}
                      subHeading={"or Browse media on your device"}
                      name={name}
                      website={website}
                      description={description}
                      filSide={filSide}
                      category={category}
                      image={image}
                      setImage={setImage}
                      uploadToIPFS={uploadToIPFS}
                      uploading={uploading}
            />
            <div>
                <div>
                    <label htmlFor={"name"}>Item Name</label>
                    <input type={"text"}
                           onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label htmlFor={"website"}>Website</label>
                    <input type={"text"}
                           onChange={(e) => setWebsite(e.target.value)} />
                </div>
                <div>
                    <label htmlFor={"description"}>Description</label>
                    <input type={"text"}
                           onChange={(e) => setDescription(e.target.value)} />
                    <p>The description will be included on the items detail page underneath its image. Markdown syntax
                        is supported.</p>
                </div>
                <div>
                    <label htmlFor={"description"}>File Size</label>
                    <input type={"text"}
                           placeholder={'165MB'}
                           onChange={(e) => setFileSize(e.target.value)} />

                </div>
            </div>
            <div>
                <Button onClick={async ()=> createNFT(name, image, description, router, website, filSide)}>
                    Upload
                </Button>
            </div>
        </div>
    )
}
export default UploadNFT;