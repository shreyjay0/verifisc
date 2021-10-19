import Web3Modal from "web3modal";
import Web3 from "web3";
import { config } from "../config";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { createContext, useState } from "react";

const initWalletDetails = {
  connection: false,
  account: "",
  bal: 0,
  username: "",
  provider: undefined,
  connectToWallet: () => {},
  disconnectTFromWallet: () => {},
};
const PASS = "this_is_a_secret_to_heaven_1001";
const getWalletConnectContext = createContext<{
  connection: boolean;
  account: String;
  bal: Number;
  username: String;
  provider: undefined;
  connectToWallet: () => void;
  disconnectTFromWallet: () => void;
}>(initWalletDetails);

const getBscOptions = () => {
  const bscOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          56: "https://bsc-dataseed.binance.org/",
        },
        network: "binance",
      },
    },
  };
  return bscOptions;
};
const checkCurrentChain = async (chainId: any) => {
  if (chainId === 56) {
    return true;
  } else {
    return false;
  }
};
const promiseRes = (val: any) => {
  new Promise((resolve, reject) =>
    val((error: any, result: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
        console.log(result);
      }
    })
  );
};
const Web3ConnectModal = async (username: string) => {
  const web3Connect = new Web3Modal({
    cacheProvider: false,
    providerOptions: getBscOptions(),
  });
  web3Connect.clearCachedProvider();

  const provider = await web3Connect.connect();
  const web3 = new Web3(provider);
  const chainId = await web3.eth.getChainId();
  const val = checkCurrentChain(chainId);
  const address = await web3.eth.getAccounts();
  const signed = await web3.eth.personal
    .sign(username, address[0], PASS)
    .then(console.log);
};

export default Web3ConnectModal;
