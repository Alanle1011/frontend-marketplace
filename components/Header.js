import { ConnectButton } from "web3uikit"
import Link from "next/link"
import Image from "next/image"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <div className="flex w-full h-full">
                <Link href="/">
                    <div className='flex'>
                        <div className="h-full py-4">
                            <img src={"/favicon.ico"} alt={"icon"} width={"40px"} className={"rounded-full"} />
                        </div>
                        <h1 className="p-4 font-bold text-3xl">NFT Marketplace</h1>
                    </div>
                </Link>
            </div>
            <div className="flex flex-row items-center whitespace-nowrap">
                <Link href="/">
                    <a className="mr-4 p-6">Home</a>
                </Link>
                <Link href="/upload-nft">
                    <a className="mr-4 p-6">Upload NFT</a>
                </Link>
                <Link href="/profile">
                    <a className="mr-4 p-6">Profile</a>
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
