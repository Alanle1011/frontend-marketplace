import formidable from "formidable"

const pinataSDK = require("@pinata/sdk");
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY
const PINATA_API_SECRET = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY
const pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET)



const saveJsonData = async (metadata) => {
    try {
        console.log("metadata", metadata);
        return await pinata.pinJSONToIPFS(metadata);
    } catch (error) {
        throw error;
    }
};

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const body = JSON.parse(req.body);
            const response = await saveJsonData(body);
            const { IpfsHash } = response;
            return res.send(IpfsHash);
        } catch (e) {
            console.log(e);
            res.status(500).send("Server Error");
        }
    }
    else if (req.method === "GET") {
        try {
            const response = await pinata.pinList(
                { pinataJWTKey: process.env.PINATA_JWT },
                {
                    pageLimit: 1,
                }
            );
            res.json(response.rows[0]);
        } catch (e) {
            console.log(e);
            res.status(500).send("Server Error");
        }
    }
}