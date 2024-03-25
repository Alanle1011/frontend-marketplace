import { ConnectButton } from "web3uikit"
import Link from "next/link"
import Image from "next/image"

export default function Header() {
    return (
        <>
            <div
                className="bg-gradient-animation flex h-[28px] items-center justify-center gap-8 bg-gradient-to-r from-violet-400 to-indigo-200 ">
                <p className="text line-clamp-1 px-2 text-sm font-medium">
                    Hey, welcome to Alanle Marketplace, get on board and
                    capture the NFT landscape with us 🚀 🚀
                </p>
            </div>
            <nav className="sticky top-0 px-16 border-b-2 flex flex-row justify-between items-center bg-white z-50">
                <div className="flex w-full h-full">
                    <Link href="/">
                        <div className='flex'>
                            <div className="h-full py-4">
                                <img src={"/favicon.ico"} alt={"icon"} width={"30px"} className={"rounded-full"} />
                            </div>
                            <h1 className="p-4 font-bold text-xl">NFT Marketplace</h1>
                        </div>
                    </Link>
                </div>
                <div className="flex flex-row items-center justify-center whitespace-nowrap h-full">
                    <Link href="/">
                        <a className="mr-4 p-4 font-bold hover:bg-gray-200 rounded-lg">Home</a>
                    </Link>
                    <Link href="/upload-nft">
                        <a className="mr-4 p-4 font-bold hover:bg-gray-200 rounded-lg">Upload NFT</a>
                    </Link>
                    <Link href="/profile">
                        <a className="mr-4 p-4 font-bold hover:bg-gray-200 rounded-lg">Profile</a>
                    </Link>
                    <div className="flex justify-center items-center h-full my-1 min-h-[2em] w-0.5 bg-gray-400"/>
                    <ConnectButton moralisAuth={false} />
                </div>
            </nav>
        </>

    )
}
