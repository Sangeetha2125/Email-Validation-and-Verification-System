import { Box, CircularProgress } from "@mui/material"

function CircularLoader() {
  return (
    <Box sx={{ display:"flex",justifyContent:"center",alignItems:"center",height:"60vh"}}>
      <CircularProgress/>
    </Box>
  )
}

export default CircularLoader