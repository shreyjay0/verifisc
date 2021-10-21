import { Alert, Stack, Typography } from "@mui/material";
import React from "react";

interface addressType {
  address: string;
  balance: number;
}

function SuccessAddress(props: addressType) {
  return (
    <Stack sx={{ minHeight: "60vh" }}>
      <Alert
        className="msg-in-animation"
        severity="success"
        sx={{
          margin: "auto 20px",
          animation: "ease-in",
          animationDelay: "2s",
          transitionDelay: "5s",
        }}
      >
        <Typography>
          You have successfully signed with address:
          {props.address}
          <br />
          <br />
          BNB balance: {props.balance}
        </Typography>
      </Alert>
    </Stack>
  );
}

export default SuccessAddress;
