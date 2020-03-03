const DAO = artifacts.require("DAO");
const ProofsHandler = artifacts.require("ProofsHandler");

const DataWipeProofs = artifacts.require("DataWipeProofs");
const TransferProofs = artifacts.require("TransferProofs");
const ReuseProofs = artifacts.require("ReuseProofs");
const RecycleProofs = artifacts.require("RecycleProofs");
const FunctionProofs = artifacts.require("FunctionProofs");

module.exports = async (deployer, network, accounts) => {

    await deployer.deploy(ProofsHandler, { from: accounts[0] })
        .then(async function (handler) {
            await deployer.deploy(DataWipeProofs, { from: accounts[0] })
                .then(async function (proofs) {
                    await handler.setDataWipeProofs(proofs.address);
                });
            await deployer.deploy(TransferProofs, { from: accounts[0] })
                .then(async function (proofs) {
                    await handler.setTransferProofs(proofs.address);
                });
            await deployer.deploy(ReuseProofs, { from: accounts[0] })
                .then(async function (proofs) {
                    await handler.setReuseProofs(proofs.address);
                });
            await deployer.deploy(RecycleProofs, { from: accounts[0] })
                .then(async function (proofs) {
                    await handler.setRecycleProofs(proofs.address);
                });
            await deployer.deploy(FunctionProofs, { from: accounts[0] })
                .then(async function (proofs) {
                    await handler.setFunctionProofs(proofs.address);
                });
            await DAO.deployed()
                .then(async function (dao) {
                    await dao.setProofsHandler(handler.address);
                });
        });
};