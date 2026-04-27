import React from "react";
import { Box, Button, Fade, Stack, TextField, Typography } from "@mui/material";
import { GooglePlayIcon } from "../../../atomComponents/googlePlayIcon";

const PlaystoreContent = ({
  playstoreLink,
  setPlaystoreLink,
  selectedPlatform,
  loading,
  handleScrape,
  playstoreLimit,
  setPlaystoreLimit,
}) => {
  const getValueCount = (value) => {
    if (value > 200) {
      return 200;
    } else if (value < 0) {
      return 1;
    } else {
      return value;
    }
  };
  return (
    <Fade in={selectedPlatform === "playstore"} timeout={500}>
      <Box
        sx={{
          mt: 2,
          mb: 3,
          p: 3,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          bgcolor: "#fdfdfd",
          boxShadow: 1,
        }}
      >
        <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
          <GooglePlayIcon width={21} height={21} />
          <Typography variant="h6" component="h2">
            Extract Reviews from Play Store
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter the Google Play Store app link to retrieve reviews.
        </Typography>
        <TextField
          fullWidth
          label="Play Store App Link"
          variant="outlined"
          value={playstoreLink}
          onChange={(e) => setPlaystoreLink(e.target.value)}
          placeholder="Example: https://play.google.com/store/apps/details?id=com.whatsapp"
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Maximum of Reviews to Extract"
          variant="outlined"
          value={playstoreLimit}
          onChange={(e) => {
            const value = getValueCount(e.target.value);
            setPlaystoreLimit(value);
          }}
          placeholder="200"
          type="number"
          inputProps={{ min: 1 }}
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <Button
          variant="contained"
          color="info"
          fullWidth
          onClick={() => handleScrape("playstore")}
          disabled={loading}
        >
          Fetch Review Data
        </Button>
      </Box>
    </Fade>
  );
};

export default PlaystoreContent;
