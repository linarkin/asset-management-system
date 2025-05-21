import { Box, Toolbar, Typography, Container } from "@mui/material";
import Home from "./pages/HomePage";
//import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <Box>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Asset Management
        </Typography>
      </Toolbar>

      <Container
        maxWidth="xl"
        sx={{
          py: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Home />
      </Container>
    </Box>
  );
}

export default App;
