import {
  Box,
  Button,
  Fade,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { RiTwitterXLine } from "react-icons/ri";

const languages = [
  { value: "en", label: "English" },
  { value: "id", label: "Bahasa Indonesia" },
];

const TwitterContent = ({
  twitterKeyword,
  setTwitterKeyword,
  twitterLimit,
  setTwitterLimit,
  twitterStartDate,
  setTwitterStartDate,
  twitterEndDate,
  setTwitterEndDate,
  twitterLanguage,
  setTwitterLanguage,
  selectedPlatform,
  loading,
  handleScrape,
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
    <Fade in={selectedPlatform === "twitter"} timeout={500}>
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
          <RiTwitterXLine size={25} style={{ marginRight: "5px" }} />
          <Typography variant="h6" component="h2">
            Extract Tweets from X
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter search criteria to retrieve tweets.
        </Typography>
        <TextField
          fullWidth
          label="Search Keyword"
          variant="outlined"
          value={twitterKeyword}
          onChange={(e) => setTwitterKeyword(e.target.value)}
          placeholder="Example: #AI OR machinelearning"
          sx={{ mb: 2 }}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            variant="outlined"
            value={twitterStartDate}
            onChange={(e) => setTwitterStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            variant="outlined"
            value={twitterEndDate}
            onChange={(e) => setTwitterEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={loading}
          />
        </Stack>
        <TextField
          select
          fullWidth
          label="Language"
          variant="outlined"
          value={twitterLanguage}
          onChange={(e) => setTwitterLanguage(e.target.value)}
          sx={{ mb: 2 }}
          disabled={loading}
        >
          {languages.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Maximum of Reviews to Extract"
          variant="outlined"
          value={twitterLimit}
          onChange={(e) => {
            const value = getValueCount(e.target.value);
            setTwitterLimit(value);
          }}
          placeholder="100"
          type="number"
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
            onClick={() => handleScrape("twitter")}
            disabled={loading}
          >
            Fetch Tweet Data
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default TwitterContent;
