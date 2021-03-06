/*eslint-disable*/
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertColor from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import {
  getBscOptions,
  checkCurrentChain,
  promiseRes,
  PASS,
} from "../utils/Web3ConnectModal";
import {
  InputHandler,
  ButtonEventHandler,
  msgBoxColor,
  KeyboardInputHandler,
} from "../types/types";
import { prettyDOM } from "@testing-library/dom";
import { editables } from "../components/Editables";
import Back1 from "../assets/back1.webp";
import SuccessAddress from "../components/SuccessAddress";
import Web3Modal, { providers } from "web3modal";
import Web3 from "web3";
import { config } from "../config";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { walletconnect } from "web3modal/dist/providers/connectors";
import { convertToObject } from "typescript";
const bscOptions = {
  chainId: 56,
  urlRpc: "https://bsc-dataseed.binance.org/",
};

const connectWallet = async () => {
  const provider = await detectEthereumProvider();

  return window.ethereum == provider;
};

const ACTIVITY = {
  CONNECT: "wallet connection",
  SIGN: "message signature",
  IDLE: "",
};

type setUserType = {
  onClick?: ButtonEventHandler;
};

function User(props: setUserType) {
  let pVal: boolean = false;
  const [connected, setconnected]: [
    boolean,
    Dispatch<SetStateAction<boolean>>
  ] = useState(Boolean(false));
  const [hasProvider, sethasProvider] = useState<boolean>(pVal);
  const [username, setusername] = useState("");
  const [accepted, setaccepted] = useState(null);
  const [activity, setactivity] = useState(ACTIVITY.IDLE);
  const [showMsg, setshowMsg] = useState(false);
  const [timeout, settimeout] = useState(8);
  const [hasMsg, sethasMsg] = useState(false);
  const [popMsg, setpopMsg] = useState({
    type: "",
    code: null,
    msg: "",
  });
  const [addressSigned, setaddressSigned] = useState(false);
  const [signInfo, setsignInfo] = useState({
    address: "",
    username: "",
    sign: "",
  });
  const timeRef = useRef();
  const [provider, setprovider] = useState<any>();
  const [userAddress, setuserAddress] = useState("");
  const [bal, setbal] = useState(0);
  const [connection, setconnection] = useState(false);
  const [chainId, setchainId] = useState(1);
  const [signature, setsignature] = useState("");
  const [account, setaccount] = useState<any>();
  const [w3, setw3] = useState<any>();
  const [chainError, setchainError] = useState(false);
  const [signPromise, setsignPromise] = useState<any>();
  const displayActionMsg = (msg: string, type: string) => {
    setpopMsg((pre) => ({
      ...pre,
      msg: msg,
      type: type,
    }));
    sethasMsg(true);
  };

  const walletDisconnected = () => {
    setconnection(false);
    setuserAddress("");
    setaccount([]);
    setbal(0);
    setchainId(1);
  };
  async function getProvider(w3c: any) {
    try {
      const provider = await w3c.connect();

      if (provider != undefined) {
        sethasProvider(true);
      }
      await setprovider(w3c);
      try {
        const web3 = new Web3(provider);
        reqSign(provider, web3);
      } catch (err) {
        walletDisconnected();
        displayActionMsg(JSON.stringify(err), "error");
        console.log(err);
      }
    } catch (err) {
      displayActionMsg(JSON.stringify(err), "info");
      walletDisconnected();
      console.log(err);
    }
  }
  async function reqSign(provider: any, web3: any) {
    const cId = await web3.eth.getChainId();
    await setchainId(cId);
    if (await checkCurrentChain(cId)) {
      const address = await web3.eth.getAccounts();
      const e18convert = Math.pow(10, 18);
      const signed = await web3.eth.personal.sign(username, address[0], PASS);

      const vall = await Promise.all([address, signed, account]).then((val) => {
        return val;
      });
      // [setuserAddress(address[0]),setsignature(signed), setaccount(await address),setbal(b/e18convert)] = signPromise
      setuserAddress(address[0]);
      const b = await web3.eth.getBalance(address[0]);
      setbal(b / e18convert);
      setsignInfo({
        address: userAddress,
        username: username,
        sign: signature,
      });
      setaddressSigned(true);
      if (signature != "") {
      }
    } else {
      setchainError(true);
    }
  }
  const signUser = () => {
    const web3Connect = new Web3Modal({
      cacheProvider: false,
      providerOptions: getBscOptions(),
    });
    getProvider(web3Connect);
  };

  const onSubmitUsername = (e: ButtonEventHandler): void => {
    e.preventDefault();
    if (username == "") {
      setpopMsg((pre) => ({
        ...pre,
        msg: "Username can't be left blank",
        type: "error",
      }));
      sethasMsg(true);
    } else {
      signUser();
    }
  };
  const closePopMsg = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    sethasMsg(false);
    setpopMsg({
      type: "",
      code: null,
      msg: "",
    });
    settimeout(8);
  };
  const onKeyPress = (e: any) => {
    if (e.key === "Enter") {
      onSubmitUsername(e);
    }
  };
  useEffect(() => {
    setshowMsg(accepted != null);
    const val = connectWallet();
    sethasProvider(true);
    if (hasProvider) {
      console.log("ok");
    } else {
      console.log("Please install metamask");
    }
  }, []);

  useEffect(() => {}, []);

  const theme = useTheme();
  return (
    <>
      <Card
        className="mui-card-outer"
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          maxWidth: 600,
          borderRadius: 2,
          textAlign: "left",
          position: "absolute",
        }}
      >
        {addressSigned ? (
          <SuccessAddress address={userAddress} balance={bal} />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography
                component="div"
                variant="h5"
                sx={{
                  background: "#6c12d94d",
                  padding: 1,
                  borderRadius: 1,
                  color: "#a32ab4",
                  fontWeight: 600,
                }}
              >
                Member registration
              </Typography>
              <Typography
                color="text.secondary"
                component="div"
                sx={{
                  minWidth: 200,
                  textAlign: "left",
                  margin: "17px 0",
                }}
              >
                {editables.description}
              </Typography>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  maxWidth: 300,
                }}
              >
                <IconButton sx={{ p: "10px" }} aria-label="menu">
                  @
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Enter telegram username"
                  inputProps={{ "aria-label": "input-username" }}
                  value={username}
                  onChange={(e) => {
                    setusername(e.target.value);
                  }}
                  onKeyPress={onKeyPress}
                />

                {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> */}
              </Paper>
              <Button
                className="submit-username"
                variant="contained"
                onClick={onSubmitUsername}
                sx={{ margin: "20px 0 0 0" }}
              >
                Proceed with signature
              </Button>
              <Box>
                <Typography
                  sx={{
                    color: "grey !important",
                    letterSpacing: "0 !important",
                    fontWeight: 400,
                    fontSize: "0.75rem",
                    marginTop: 1,
                  }}
                >
                  {editables.footerMsg}
                </Typography>
              </Box>
            </CardContent>
            <Box
              sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
            ></Box>
          </Box>
        )}
        <CardMedia
          className="mui-img-show"
          component="img"
          sx={{ width: 151 }}
          image={Back1}
          alt="Intro Cover"
        />
      </Card>
      {hasMsg && (
        <Alert
          onClose={closePopMsg}
          style={{ marginTop: "38em", position: "absolute" }}
          {...(popMsg.type == "error"
            ? { severity: "error" }
            : popMsg.type == "success"
            ? { severity: "success" }
            : { severity: "info" })}
        >
          {popMsg.code == null ? popMsg.msg : popMsg.code + ": " + popMsg.msg}
        </Alert>
      )}

      {showMsg &&
        (accepted ? (
          <Alert severity="success">Success</Alert>
        ) : (
          <Alert severity="error">
            Couldn't verify your signature. Retry after refreshing or check your
            provider's setting if still not working{" "}
          </Alert>
        ))}
    </>
  );
}

export default User;
