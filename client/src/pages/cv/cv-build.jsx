import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { TextField, Button, Container, Typography, Box, IconButton, Snackbar, Alert } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import API from "../../api/api";
import { useAuth } from "../../store/AuthContext";
import { useNavigate } from 'react-router-dom';

const CVBuilder = () => {
  const { user } = useAuth();
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

  useEffect(() => {
    if (user) {
      setValue("name", user.name || ""); 
      setValue("email", user.email || ""); 
    }
  }, [user, setValue]);

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
      const token = localStorage.getItem("token");
      const res = await API.post("/cv/create-cv", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: "success", text: res.data.message || "CV created Successful!" });
      reset();
      navigate("/")
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.response?.data?.message || "Error creating CV" });
    }
  };

  return (
    <Container sx={{ margin: 4 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h4" gutterBottom>
        Create Your CV
      </Typography>
    </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField fullWidth label="Name" InputProps={{ readOnly: true }}  {...register("name", { required: "Name is required" })} margin="normal" error={!!errors.name} helperText={errors.name?.message} />

        <TextField fullWidth label="Email" InputProps={{ readOnly: true }}  {...register("email", { required: "Email is required" })} margin="normal" error={!!errors.email} helperText={errors.email?.message} />

        <TextField fullWidth label="Mobile" {...register("mobile", { required: "Mobile number is required" })} margin="normal" error={!!errors.mobile} helperText={errors.mobile?.message} />

        <TextField fullWidth label="Address" {...register("address", { required: "Address is required" })} margin="normal" error={!!errors.address} helperText={errors.address?.message} />

        <TextField fullWidth label="LinkedIn Profile" {...register("linkedInProfile")} margin="normal" />
        <TextField fullWidth label="GitHub Profile" {...register("githubProfile")} margin="normal" />

        <Typography variant="h6">Work Experience</Typography>
        {workFields.map((exp, index) => (
          <Box key={exp.id} display="flex" gap={2} mb={3} alignItems="center">

            <TextField label="Job Title" {...register(`workExperience.${index}.jobTitle`, { required: "Job Title is required" })} error={!!errors.workExperience?.[index]?.jobTitle} helperText={errors.workExperience?.[index]?.jobTitle?.message} />

            <TextField label="Company" {...register(`workExperience.${index}.companyName`, { required: "Company Name is required" })} error={!!errors.workExperience?.[index]?.companyName} helperText={errors.workExperience?.[index]?.companyName?.message} />

            <TextField type="date" label="Start Date" {...register(`workExperience.${index}.startDate`, { required: "Start Date is required" })} InputLabelProps={{ shrink: true }} error={!!errors.workExperience?.[index]?.startDate} helperText={errors.workExperience?.[index]?.startDate?.message} />

            <TextField type="date" label="End Date" {...register(`workExperience.${index}.endDate`, { required: "End Date is required" })} InputLabelProps={{ shrink: true }} error={!!errors.workExperience?.[index]?.endDate} helperText={errors.workExperience?.[index]?.endDate?.message} />

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
            <TextField label="Degree" {...register(`education.${index}.degree`, { required: "Degree is required" })} error={!!errors.education?.[index]?.degree} helperText={errors.education?.[index]?.degree?.message} />

            <TextField label="Institution" {...register(`education.${index}.institution`, { required: "Institution Name is required" })} error={!!errors.education?.[index]?.institution} helperText={errors.education?.[index]?.institution?.message} />

            <TextField type="date" label="Start Date" {...register(`education.${index}.startDate`, { required: "Start Date is required" })} InputLabelProps={{ shrink: true }} error={!!errors.education?.[index]?.startDate} helperText={errors.education?.[index]?.startDate?.message} />

            <TextField type="date" label="End Date" {...register(`education.${index}.endDate`, { required: "End Date is required" })} InputLabelProps={{ shrink: true }} error={!!errors.education?.[index]?.endDate} helperText={errors.education?.[index]?.endDate?.message} />

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
          Submit CV
        </Button>
          <Snackbar open={!!message.text} autoHideDuration={3000} onClose={() => setMessage({ type: "", text: "" })}>
            <Alert severity={message.type === "success" ? "success" : "error"}>{message.text}</Alert>
          </Snackbar>
      </Box>
    </Container>
  );
};

export default CVBuilder;
