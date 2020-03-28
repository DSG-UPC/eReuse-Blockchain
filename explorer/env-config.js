// This file is evaluated when exporting the frontend application
// The environment variabled need to be set locally on in the CI/CD console

const DEVELOPMENT = process.env.NODE_ENV !== "production"
    && false

module.exports = {

    // BLOCKCHAIN
    // ETH_NETWORK_ID: process.env.ETH_NETWORK_ID || "goerli",
}

console.log("Building the frontend with ENV:", module.exports)
