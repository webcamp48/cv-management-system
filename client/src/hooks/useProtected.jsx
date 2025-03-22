import { useEffect, useState } from "react";
import { useAuth } from "../store/AuthContext";
import { toast } from "react-toastify";

const useProtected = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please login to access this page!")
    }
  }, [user, loading]);

  return { user, loading };
};

export default useProtected;
