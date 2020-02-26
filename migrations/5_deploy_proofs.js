const DAO = artifacts.require("DAO");
const ProofsHandler = artifacts.require("ProofsHandler");

const DataWipeProofs = artifacts.require("DataWipeProofs");
const DisposalProofs = artifacts.require("DisposalProofs");
const ReuseProofs = artifacts.require("ReuseProofs");
const RecycleProofs = artifacts.require("RecycleProofs");
const FunctionProofs = artifacts.require("FunctionProofs");

module.exports = async (deployer, network, accounts) => {


    await deployer.deploy(ProofsHandler, { from: accounts[0] })
        .then(async function (handler) {
            await deployer.deploy(DataWipeProofs, { from: accounts[0] })
                .then(async function (proofs) {
                    handler.setDataWipeProofs(proofs.address);
                });
            await deployer.deploy(DisposalProofs, { from: accounts[0] })
                .then(async function (proofs) {
                    handler.setDisposalProofs(proofs.address);
                });
            await deployer.deploy(ReuseProofs, { from: accounts[0] })
                .then(async function (proofs) {
                    handler.setReuseProofs(proofs.address);
                });
            await deployer.deploy(RecycleProofs, { from: accounts[0] })
                .then(async function (proofs) {
                    handler.setRecycleProofs(proofs.address);
                });
            await deployer.deploy(FunctionProofs, { from: accounts[0] })
                .then(async function (proofs) {
                    handler.setFunctionProofs(proofs.address);
                });
        });
};