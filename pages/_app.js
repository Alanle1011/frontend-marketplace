import "../styles/globals.css"
import Head from "next/head"
import { MoralisProvider, useChain, useMoralis } from "react-moralis"
import Header from "../components/Header"
import { NotificationProvider } from "web3uikit"
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client"
import Footer from "../components/Footer"

const arbitrum = new HttpLink({
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_ARBITRUM_URL,
})
const sepolia = new HttpLink({
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
})

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.split(
        operation => operation.getContext().clientName === '0xaa36a7',
        sepolia, //if above
        arbitrum,
    )
})

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Alanle Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client} >
                    <NotificationProvider>
                            <Header />
                            <Component {...pageProps} />
                            <Footer />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp
