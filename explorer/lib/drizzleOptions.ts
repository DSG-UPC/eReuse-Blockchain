import Web3 from "web3";
// import DAO from "../../contracts/DAO.json";
import DAO from "../../build/contracts/DAO.json";
// import SimpleStorage from "../contracts/SimpleStorage.json";
// import TutorialToken from "../contracts/TutorialToken.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:8545"),
  },
  contracts: [DAO as any],
  // events: {
  //   SimpleStorage: ["StorageSet"],
  // },
};

export default options;
