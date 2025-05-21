import React from "react";
import { Box, Typography } from "@mui/material";
import type { Label } from "../../types/types";

interface LabelItemProps {
  label: Label;
}

const LabelItem: React.FC<LabelItemProps> = ({ label }) => (
  <Box
    sx={{
      display: "flex",
      border: "1px solid #e0e0e0",
      borderRadius: 1,
      p: 1,
      mb: 1,
    }}
  >
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mr: 1, fontWeight: 500 }}
    >
      {label.key}:
    </Typography>
    <Typography variant="body2">{label.value}</Typography>
  </Box>
);

export default LabelItem;
