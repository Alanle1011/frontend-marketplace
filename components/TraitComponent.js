import React, { useEffect, useState } from "react"
import { Input, Modal } from "web3uikit"


const TraitList = ({ traits, handleEditTrait, handleDeleteTrait }) => (
    <ul>
        {traits.map((item, index) => (
            <div key={index} className={"flex justify-between my-1 p-5 bg-gray-300 rounded-xl"}>
                <p>
                    {item.trait}: {item.value}
                </p>
                <div className={"flex gap-2"}>
                    <button onClick={() => handleEditTrait(item, index)}>Edit</button>
                    <button onClick={() => handleDeleteTrait(index)}>Delete</button>
                </div>
            </div>
        ))}
    </ul>
)

const TraitModal = ({onEditTrait, editTrait, onDeleteTrait, onAddTrait, isVisible, onClose }) => {
    const [trait, setTrait] = useState("")
    const [value, setValue] = useState("")
    const [editIndex, setEditIndex] = useState()

    const handleAddTrait = () => {
        if (trait && value) {
            onAddTrait({ trait, value })
            setTrait("")
            setValue("")
            setEditIndex(null)

        }
        onClose()
    }
    const handleEditTrait = () => {
        if (trait && value && editIndex !== null) {
            onEditTrait({ trait, value }, editIndex)
        }
        onClose()
    }

    useEffect(() => {
        if (editTrait) {
            setTrait(editTrait.trait)
            setValue(editTrait.value)
            setEditIndex(editTrait.index)
        } else {
            setTrait("")
            setValue("")
            setEditIndex(null)
        }
    }, [editTrait, onClose])

    return (
        <Modal
            title={"Listing Price"}
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={async () => {
                if (editIndex !== null) {
                    handleEditTrait()
                } else {
                    handleAddTrait()
                }

            }}
            width={"30vw"}
            isCentered={true}
        >
            <div className={"flex flex-col"}>
                <label>
                    Trait:
                    <input type="text" value={trait} onChange={(e) => setTrait(e.target.value)} />
                </label>
                <label>
                    Value:
                    <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
                </label>
            </div>
        </Modal>
    )
}

export { TraitModal, TraitList }