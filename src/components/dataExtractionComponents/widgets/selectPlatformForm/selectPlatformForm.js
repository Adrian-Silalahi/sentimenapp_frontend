import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { GooglePlayIcon } from "../../../atomComponents/googlePlayIcon";
import { YouTube as YouTubeIcon } from "@mui/icons-material";
import { RiTwitterXLine } from "react-icons/ri";

const SelectPlatformForm = ({ selectedPlatform, handlePlatformChange }) => {
  return (
    <FormControl fullWidth sx={{ mb: 3 }} focused={false}>
      <InputLabel id="platform-select-label">Select Platform</InputLabel>
      <Select
        labelId="platform-select-label"
        id="platform-select"
        value={selectedPlatform}
        label="Select Platform"
        onChange={handlePlatformChange}
        sx={{ borderRadius: "8px" }}
      >
        <MenuItem value="">
          <em>-- Select --</em>
        </MenuItem>
        <MenuItem value="playstore">
          <Stack direction="row" alignItems="center" gap={1}>
            <GooglePlayIcon width={21} height={21} /> Google Play Store
          </Stack>
        </MenuItem>
        <MenuItem value="youtube">
          <Stack direction="row" alignItems="center" gap={1}>
            <YouTubeIcon sx={{ color: "#FF0000" }} /> YouTube
          </Stack>
        </MenuItem>
        {/* NEW: Tambahkan MenuItem untuk Twitter dengan XIcon */}
        <MenuItem value="twitter">
          <Stack direction="row" alignItems="center" gap={1}>
            {/* Atur warna XIcon. Biasanya logo X hitam/putih */}
            <RiTwitterXLine size={21} style={{ marginRight: "5px" }} />X
            (Formerly known as Twitter)
          </Stack>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default SelectPlatformForm;
