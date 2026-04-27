import { Box, Button, Fade, Stack, TextField, Typography } from "@mui/material";

const YoutubeContent = ({
  youtubeLink,
  setYoutubeLink,
  selectedPlatform,
  loading,
  handleScrape,
  youtubeLimit,
  setYoutubeLimit,
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
    <Fade in={selectedPlatform === "youtube"} timeout={500}>
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
          <Typography variant="h6" component="h2">
            Extract Comments from YouTube
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter the YouTube video link to retrieve comments.
        </Typography>
        <TextField
          fullWidth
          label="YouTube Video Link"
          variant="outlined"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          placeholder="Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Maximum of Comments to Extract"
          type="number"
          variant="outlined"
          value={youtubeLimit}
          onChange={(e) => {
            const value = getValueCount(e.target.value);
            setYoutubeLimit(value);
          }}
          inputProps={{ min: 1 }}
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <Box
          className="download-box"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          fullWidth
        >
          <Button
            fullWidth
            variant="contained"
            color="info"
            onClick={() => handleScrape("youtube")}
            disabled={loading}
          >
            Fetch Comment Data
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default YoutubeContent;
