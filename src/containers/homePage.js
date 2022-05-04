import React, { useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useNavigate } from "react-router-dom";

import {
  makeSelectWallet,
  makeSelectWalletList,
  makeSelectCurrentPage,
  makeSelectIsConnected,
} from "../selectors/walletSelector";

import {
  setMnemonic,
  setDisconnected,
  setCurrentPage,
  setCurrentWallet,
} from "../actions/walletAction";

import {
  Grid,
  Divider,
  Button,
  Typography,
  Container,
  TextField,
} from "@mui/material";

import Modal from "../components/modal";
import Table from "../components/table";

import { getRandomMnemonic } from "../utils/ethers";

function HomePage(props) {
  const {
    walletList,
    currentPage,
    setMnemonic,
    isConnected,
    setCurrentPage,
    setCurrentWallet,
  } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const [mnemonicTemp, setMnemonicTemp] = useState("");
  const [isCreateNew, setIsCreateNew] = useState(false);

  const navigate = useNavigate();

  const handleOpenModal = (type) => {
    setModalOpen(true);
    // 1 is new wallet, 0 is import
    if (type === 1) {
      setIsCreateNew(true);
      generateMnemonic();
    } else {
      setIsCreateNew(false);
      setMnemonicTemp("");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const generateMnemonic = () => {
    setMnemonicTemp(getRandomMnemonic());
  };

  const chooseMnemonic = () => {
    setMnemonic(mnemonicTemp);
    handleCloseModal();
  };

  const handleMnemoniChange = (e) => {
    setMnemonicTemp(e.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const onWalletClick = (wallet) => {
    setCurrentWallet(wallet);
    navigate("/transaction")
  };

  let modalContent = <></>;

  if (isCreateNew) {
    modalContent = (
      <>
        <Typography id="parent-modal-title" variant="h4" component="h2">
          Here is your random Mnemonic
        </Typography>
        <Typography variant="h5" style={{ padding: 10 }}>
          {mnemonicTemp}
        </Typography>
        <Typography variant="body1">
          Remember your mnemonic? Then create a wallet now!!
        </Typography>
        <Button variant="contained" color="primary" onClick={chooseMnemonic}>
          CREATE WALLET
        </Button>
        <Typography variant="body1">
          Did not like this mnemonic? That's OK, let's generate a new one
        </Typography>
        <Button variant="contained" color="primary" onClick={generateMnemonic}>
          GENERATE NEW MNEMONIC
        </Button>
      </>
    );
  } else {
    modalContent = (
      <>
        <Typography id="parent-modal-title" variant="h4" component="h2">
          Here is your Mnemonic
        </Typography>
        <Typography variant="h5" style={{ padding: 10 }}>
          {mnemonicTemp}
        </Typography>
        <TextField
          id="outlined-multiline-flexible"
          label="Mnemonic"
          multiline
          maxRows={4}
          value={mnemonicTemp}
          onChange={handleMnemoniChange}
        />
        <br />
        <Button variant="contained" color="primary" onClick={chooseMnemonic}>
          IMPORT WALLET
        </Button>
      </>
    );
  }

  return (
    <Container>
      {!isConnected ? (
        <>
          <Modal open={modalOpen} handleCloseModal={handleCloseModal}>
            {modalContent}
          </Modal>
          <Grid container spacing={1} p={10}>
            <Grid item xs>
              <Typography variant="h4">Creat new Wallet</Typography>
              <Typography variant="subtitle1">
                Click the button below to start create your new wallet
              </Typography>
              <Button
                style={{ margin: 12 }}
                variant="contained"
                onClick={() => handleOpenModal(1)}
              >
                Create
              </Button>
            </Grid>
            <Divider orientation="vertical" flexItem>
              OR
            </Divider>
            <Grid item xs>
              <Typography variant="h4">Import your Wallet</Typography>
              <Typography variant="subtitle1">
                If you've already had an account, then import it here
              </Typography>
              <Button
                style={{ margin: 12 }}
                variant="contained"
                onClick={() => handleOpenModal(0)}
              >
                Import
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Typography variant="h4" style={{ margin: 30 }}>
            Your Wallet List
          </Typography>
          <Table
            data={walletList}
            currentPage={currentPage}
            changePage={handlePageChange}
            onWalletClick={onWalletClick}
          />
        </>
      )}
    </Container>
  );
}

const mapStateToProps = createStructuredSelector({
  wallet: makeSelectWallet(),
  walletList: makeSelectWalletList(),
  currentPage: makeSelectCurrentPage(),
  isConnected: makeSelectIsConnected(),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setMnemonic: (mnemonic) => dispatch(setMnemonic(mnemonic)),
    setDisconnected: () => dispatch(setDisconnected(false)),
    setCurrentPage: (page) => dispatch(setCurrentPage(page)),
    setCurrentWallet: (wallet) => dispatch(setCurrentWallet(wallet)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
