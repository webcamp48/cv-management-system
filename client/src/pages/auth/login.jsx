import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Container, Typography, Snackbar, Alert, Box, Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import API from "../../api/api";
import { useAuth } from "../../store/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await API.post("/user/login", data);
      setUser(res.data.user);
      setMessage({ type: "success", text: res.data.message || "Login Successful!" });
      setTimeout(() => navigate("/all-cv"), 1000);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth label="Email" {...register("email", { required: "Email is required" })} margin="normal"
            error={!!errors.email} helperText={errors.email?.message}
          />
          <TextField
            fullWidth label="Password" type="password" {...register("password", { required: "Password is required" })}
            margin="normal" error={!!errors.password} helperText={errors.password?.message}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
      <Divider sx={{ flexGrow: 1 }} />
      <Typography sx={{ mx: 1, color: "gray" }}>OR</Typography>
      <Divider sx={{ flexGrow: 1 }} />
    </Box>
    <Typography variant="body2" align="center">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </Typography>
      </Box>
      <Snackbar open={!!message.text} autoHideDuration={3000} onClose={() => setMessage({ type: "", text: "" })}>
        <Alert severity={message.type === "success" ? "success" : "error"}>{message.text}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
