import React, { useContext, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, IconButton, Typography, Box, Snackbar, Alert, Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import { Delete, Visibility, Download, Edit, Logout } from "@mui/icons-material";
import API from "../../api/api";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/AuthContext";



const CVList = () => {
  const { logout } = useContext(AuthContext); 
  const [cvList, setCvList] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchCVs();
  }, []);

  // Fetch all CVs
  const fetchCVs = async () => {
    try {
      const res = await API.get("/cv/get-all-cv");
      setCvList(res.data.cvs);
    } catch (error) {
      console.error("Error fetching CVs", error);
    }
  };

  // Delete CV
  const handleDelete = async (cvId) => {
    if (window.confirm("Are you sure you want to delete this CV?")) {
      try {
        await API.delete(`/cv/delete-cv/${cvId}`);
        setCvList(cvList.filter((cv) => cv._id !== cvId));
        setMessage({ type: "success", text: "CV deleted successfully!" });
      } catch (error) {
        console.error("Error deleting CV", error);
        setMessage({ type: "error", text: "Failed to delete CV!" });
      }
    }
  };

  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };

  // Preview CV
  const handlePreview = (cv) => {
    setSelectedCV(cv);
    setOpenPreview(true);
  };

  // Download CV as PDF
  const handleDownload = (cv) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");

    doc.text("CV Details", 10, 10);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");

    const addText = (label, value, yPos) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}: `, 10, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(value || "N/A", 50, yPos);
    };

    addText("Name", cv.name, 20);
    addText("Email", cv.email, 30);
    addText("Mobile", cv.mobile, 40);
    addText("Address", cv.address, 50);
    addText("LinkedIn", cv.linkedInProfile, 60);
    addText("GitHub", cv.githubProfile, 70);

    // Education 
    if (cv.education?.length) {
      doc.setFont("helvetica", "bold");
      doc.text("Education", 10, 90);
      doc.setFont("helvetica", "normal");

      cv.education.forEach((edu, index) => {
        const y = 100 + index * 20;
        addText("Degree", edu.degree, y);
        addText("Institution", edu.institution, y + 10);
        addText("Start Date", edu.startDate.split("T")[0], y + 20);
        addText("End Date", edu.endDate.split("T")[0], y + 30);
      });
    }

    // work Experience 
    if (cv.workExperience?.length) {
      doc.setFont("helvetica", "bold");
      doc.text("Work Experience", 10, 150);
      doc.setFont("helvetica", "normal");

      cv.workExperience.forEach((work, index) => {
        const y = 160 + index * 20;
        addText("Company", work.companyName, y);
        addText("Job Title", work.jobTitle, y + 10);
        addText("Start Date", work.startDate.split("T")[0], y + 20);
        addText("End Date", work.endDate.split("T")[0], y + 30);
      });
    }

    doc.save(`${cv.name}_CV.pdf`);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "mobile", headerName: "Mobile", width: 130 },
    { field: "address", headerName: "Address", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handlePreview(params.row)}>
            <Visibility />
          </IconButton>
          <IconButton color="success" onClick={() => handleDownload(params.row)}>
            <Download />
          </IconButton>
          <IconButton color="info" onClick={() => navigate(`/update-cv/${params.row.cvId}`)}>
            <Edit />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row.cvId)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = cvList.map((cv, index) => ({
    id: index + 1, 
    cvId: cv._id,
    ...cv,
  }));

  return (
    <Paper sx={{ height: 500, width: "100%", p: 2, mt: 2, }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>All CVs Management</Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          All CVs Management
        </Typography>
        <Box>
          <Button variant="contained" onClick={() => navigate("/cv-create")} color="primary" sx={{ mr: 2 }}>
            Create CV
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout} startIcon={<Logout />}>
            Logout
          </Button>
        </Box>
      </Box>
      <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10]} />

      <Snackbar
        open={Boolean(message.text)}
        autoHideDuration={3000}
        onClose={() => setMessage({ type: "", text: "" })}
      >
        <Alert onClose={() => setMessage({ type: "", text: "" })} severity={message.type} sx={{ width: "100%" }}>
          {message.text}
        </Alert>
      </Snackbar>

      {/*  CV Preview Modal */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} fullWidth maxWidth="sm">
        <DialogTitle>CV Preview</DialogTitle>
        <DialogContent>
          {selectedCV && (
            <Box sx={{ p: 2 }}>
              <Typography><strong>Name:</strong> {selectedCV.name}</Typography>
              <Typography><strong>Email:</strong> {selectedCV.email}</Typography>
              <Typography><strong>Mobile:</strong> {selectedCV.mobile}</Typography>
              <Typography><strong>Address:</strong> {selectedCV.address}</Typography>
              <Typography><strong>LinkedIn:</strong> {selectedCV.linkedInProfile || "N/A"}</Typography>
              <Typography><strong>GitHub:</strong> {selectedCV.githubProfile || "N/A"}</Typography>
            </Box>
          )}
        </DialogContent>
        <Button onClick={() => setOpenPreview(false)}>Close</Button>
      </Dialog>
    </Paper>
  );
};

export default CVList;
