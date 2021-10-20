import Web3Modal, { providers } from "web3modal";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";

const PASS = "this_is_a_secret_to_heaven_1001";

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
      }
    })
  );
};

export { getBscOptions, checkCurrentChain, promiseRes, PASS };
