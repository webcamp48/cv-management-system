import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { TextField, Button, Container, Typography, Box, IconButton, Snackbar, Alert } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import { useAuth } from "../../store/AuthContext";

const CVUpdate = () => {
  const { user } = useAuth();
  const { cvId } = useParams(); 
  const navigate = useNavigate(); 

  const [message, setMessage] = useState({ type: "", text: "" });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      address: "",
      linkedInProfile: "",
      githubProfile: "",
      workExperience: [{ jobTitle: "", companyName: "", startDate: "", endDate: "", description: "" }],
      education: [{ degree: "", institution: "", startDate: "", endDate: "", description: "" }],
    },
  });

  // Fetch CV detail
  useEffect(() => {
    if (cvId) {
      const fetchCV = async () => {
        try {
          const res = await API.get(`/cv/get-single-cv/${cvId}`);

          if (res.data.success) {
            reset(res.data.cv);
          }
        } catch (error) {
          console.error("Error fetching CV:", error);
        }
      };

      fetchCV();
    } else if (user) {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
    }
  }, [cvId, user, reset, setValue]);

  const { fields: workFields, append: addWork, remove: removeWork } = useFieldArray({
    control,
    name: "workExperience",
  });

  const { fields: eduFields, append: addEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "education",
  });

  const onSubmit = async (data) => {
    try {

      let res;
      if (cvId) {
        res = await API.put(`/cv/update-cv/${cvId}`, data);
      }

      setMessage({ type: "success", text: res.data.message || "CV Update successfully!" });
      navigate("/all-cv"); 
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Error saving CV" });
    }
  };

  return (
    <Container sx={{ margin: 4 }}>
      <Typography variant="h4" gutterBottom>
        {"Update Your CV"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField fullWidth label="Name" InputProps={{ readOnly: true }} {...register("name")} margin="normal" />
        <TextField fullWidth label="Email" InputProps={{ readOnly: true }} {...register("email")} margin="normal" />
        <TextField fullWidth label="Mobile" {...register("mobile", { required: "Mobile number is required" })} margin="normal" />
        <TextField fullWidth label="Address" {...register("address", { required: "Address is required" })} margin="normal" />
        <TextField fullWidth label="LinkedIn Profile" {...register("linkedInProfile")} margin="normal" />
        <TextField fullWidth label="GitHub Profile" {...register("githubProfile")} margin="normal" />

        <Typography variant="h6">Work Experience</Typography>
        {workFields.map((exp, index) => (
          <Box key={exp.id} display="flex" gap={2} mb={3} alignItems="center">
            <TextField label="Job Title" {...register(`workExperience.${index}.jobTitle`)} />
            <TextField label="Company" {...register(`workExperience.${index}.companyName`)} />
            <TextField type="date" label="Start Date" {...register(`workExperience.${index}.startDate`)} InputLabelProps={{ shrink: true }} />
            <TextField type="date" label="End Date" {...register(`workExperience.${index}.endDate`)} InputLabelProps={{ shrink: true }} />
            <TextField label="Description" {...register(`workExperience.${index}.description`)} multiline rows={2} />
            <IconButton onClick={() => removeWork(index)}>
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Button startIcon={<Add />} onClick={() => addWork({ jobTitle: "", companyName: "", startDate: "", endDate: "", description: "" })}>
          Add Experience
        </Button>

        <Typography variant="h6">Education</Typography>
        {eduFields.map((edu, index) => (
          <Box key={edu.id} display="flex" gap={2} mb={3} alignItems="center">
            <TextField label="Degree" {...register(`education.${index}.degree`)} />
            <TextField label="Institution" {...register(`education.${index}.institution`)} />
            <TextField type="date" label="Start Date" {...register(`education.${index}.startDate`)} InputLabelProps={{ shrink: true }} />
            <TextField type="date" label="End Date" {...register(`education.${index}.endDate`)} InputLabelProps={{ shrink: true }} />
            <TextField label="Description" {...register(`education.${index}.description`)} multiline rows={2} />
            <IconButton onClick={() => removeEducation(index)}>
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Button startIcon={<Add />} onClick={() => addEducation({ degree: "", institution: "", startDate: "", endDate: "", description: "" })}>
          Add Education
        </Button>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          {"Update CV"}
        </Button>

        <Snackbar open={!!message.text} autoHideDuration={3000} onClose={() => setMessage({ type: "", text: "" })}>
          <Alert severity={message.type === "success" ? "success" : "error"}>{message.text}</Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default CVUpdate;
