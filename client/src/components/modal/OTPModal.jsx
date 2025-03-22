import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, TextField, Button, Snackbar, Alert, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import API from "./../../api/api";

const OTPModal = ({ open, onClose, activationToken }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!open) {
      setOtp(""); 
    }
  }, [open]);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await API.post("/user/verify-user", {
        activation_otp: otp,
        activation_token: activationToken,
      });

      setMessage({ type: "success", text: res.data.message });
      setTimeout(() => {
        onClose();
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          Enter OTP
          <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="OTP"
            value={otp}
            onChange={(e) => {
              const input = e.target.value.replace(/\D/g, ""); 
              if (input.length <= 6) setOtp(input); 
            }}
            inputProps={{ maxLength: 6, minLength: 6 }}
            margin="normal"
            helperText="Enter the 6-digit OTP sent to your email"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleVerify}
            disabled={loading || otp.length !== 6} 
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Verify OTP"}
          </Button>
        </DialogContent>
      </Dialog>
      <Snackbar open={!!message.text} autoHideDuration={3000} onClose={() => setMessage({ type: "", text: "" })}>
        <Alert severity={message.type === "success" ? "success" : "error"}>{message.text}</Alert>
      </Snackbar>
    </>
  );
};

export default OTPModal;
