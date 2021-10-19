import React from "react";
import PropTypes from "prop-types";
import { Button, Stack } from "@mui/material";

function Header(props) {
  return (
    <Stack>
      <Button>Connect Wallet</Button>
    </Stack>
  );
}

Header.propTypes = {};

export default Header;
