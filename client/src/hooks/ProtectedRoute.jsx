import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import useProtected from "./useProtected";

const ProtectedRoute = ({ element }) => {
  const { user, loading } = useProtected();

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={50} color="primary" />
      </Box>
    );

  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      {element}
    </>
  );
};

export default ProtectedRoute;
