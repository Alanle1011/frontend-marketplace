import Link from "next/link"
import Image from "next/image"

const Footer = () => {
  return (
    <div className="flex flex-col px-20 max-md:px-4 md:pt-10 border-t border-line">
      <div className="flex items-start justify-between gap-y-6 max-md:flex-wrap max-sm:flex-col">
        <div className="flex flex-col justify-end">
          <div className={'ml-10 flex flex-col items-center justify-center '}>
            <Image src='/al-logo.png' height={150} width={150} className={'rounded-full'} />
            <p className={'text-center font-bold text-xl'}>Alanle's Marketplace</p>
          </div>
        </div>
        <div className="px-2">
          <Link href="/" >
            <p className="font-bold">
              Homepage
            </p>
          </Link>
          <div className="flex flex-col gap-6 text-gray-700 max-sm:gap-2 sm:mt-5">
            {/*<Link href={'/collection'}>Collection</Link>*/}
            <Link href={'/upload-nft'}>Upload NFT</Link>
            <Link href={'/profile'}>Profile</Link>
          </div>
        </div>
        <div className="px-2">
            <p className="font-bold">
              Info
            </p>
          <div className="flex flex-col gap-6 text-gray-700 max-sm:gap-2 sm:mt-5">
            <Link href={'./Collection'}>About</Link>
          </div>
        </div>
        <div className="max-w-[350px]">
          <p className="font-bold">Join Our Community</p>
          <p className="text-gray-700 sm:mt-5">
            Keep in touch with us via Discord
            <br /> Contribute your ideas and be part of our community
          </p>
          {/*<div className="mt-5 flex h-10 items-center justify-between rounded-full bg-white/20 pl-6">*/}
          {/*  <p className="">Connect to Discord</p>*/}
          {/*  <div className="aspect-square h-full rounded-full bg-primary"></div>*/}
          {/*</div>*/}
        </div>
      </div>
      <div className="mt-8 grid w-full place-items-center border-t border-line py-4 ">
        <p className="text-sm text-gray-700">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Copyright © 2024 Alanle's Marketplace. All rights reserved. Powered by Alanle's Marketplace 🚀
        </p>
      </div>
    </div>
  )
}

export default Footer
