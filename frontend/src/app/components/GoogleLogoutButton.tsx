import { Logout as LogoutIcon } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { googleLogout } from "@react-oauth/google";

function GoogleLogoutButton() {
  const handleOnSuccessGoogle = () => {
    googleLogout();
  };

  return (
    <Box className="logout-container">
      <IconButton className="logout-button" onClick={handleOnSuccessGoogle}>
        <LogoutIcon />
        <Typography className="logout-button-label">ออกจากระบบ</Typography>
      </IconButton>
    </Box>
  );
}

export default GoogleLogoutButton;
