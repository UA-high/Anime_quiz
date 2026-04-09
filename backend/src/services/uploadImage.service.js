const imageKit = require('@imagekit/nodejs')
const config = require("../config/config")
const { toFile } = require('@imagekit/nodejs')

const client = new imageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY
})

async function uploadToCloud(buffer) {
    if(!buffer){
        console.log("Buffer is empty")
    }
    try {
        const result = await client.files.upload({
            file: await toFile(Buffer.from(buffer), "file"),
            fileName: "image_" + Date.now(),
            folder: 'Anime-quiz'
        })

        console.log("Successfully uploaded to the cloud")
        return result
    } catch (err) {
        console.log(err)
        throw new Error("Error uploading to cloud")
    }
}

module.exports = uploadToCloud

