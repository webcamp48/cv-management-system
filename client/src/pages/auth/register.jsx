import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Container, Typography, Snackbar, Alert, Box, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import API from './../../api/api';
import OTPModal from "../../components/modal/OTPModal";

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [otpOpen, setOtpOpen] = useState(false);
  const [activationToken, setActivationToken] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await API.post("/user/register-user", data);
      const successMessage = res.data.message || "OTP sent to your email";  
      setMessage({ type: "success", text: successMessage });
      setActivationToken(res.data.activation_token);
      setOtpOpen(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong"; 
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth label="Name" {...register("name", { required: "Name is required" })} margin="normal"
            error={!!errors.name} helperText={errors.name?.message}
          />
          <TextField
            fullWidth label="Email" {...register("email", { required: "Email is required" })} margin="normal"
            error={!!errors.email} helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters long" }
            })}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        
        <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
      <Divider sx={{ flexGrow: 1 }} />
      <Typography sx={{ mx: 1, color: "gray" }}>OR</Typography>
      <Divider sx={{ flexGrow: 1 }} />
    </Box>
        <Typography variant="body1" align="center">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>

      </Box>

      <Snackbar open={!!message.text} autoHideDuration={3000} onClose={() => setMessage({ type: "", text: "" })}>
        <Alert severity={message.type === "success" ? "success" : "error"}>{message.text}</Alert>
      </Snackbar>

      {/* OTP Modal */}
      <OTPModal open={otpOpen} onClose={() => setOtpOpen(false)} activationToken={activationToken} />
    </Container>
  );
};

export default Register;
