import { Box, Card, CardActions, CardContent, CardHeader, Grid, IconButton, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import Header from "../components/Header"
import SideDrawer from "../components/SideDrawer"
import Report from "../components/Report"
import EmailIcon from '@mui/icons-material/Email'
import axios from "axios"

function HomePage(){
    
    const drawerWidth = 240
    const [isDrawerOpen,setisDrawerOpen] = useState(false)
    const handleDrawerToggle = () => {
        setisDrawerOpen(!isDrawerOpen)
    }

    const [total,setTotal] = useState(0)
    const [valid,setValid] = useState(0)
    const [invalid,setInvalid] = useState(0)
    const [domain,setDomain] = useState(0)
    const [role,setRole] = useState(0)
    const [spam,setSpam] = useState(0)

    useEffect(()=>{
        const userId = JSON.parse(localStorage.getItem('current_user')).id
        axios.all([
            axios.get(`lists/total/${userId}`),
            axios.get(`lists/valid/${userId}`),
            axios.get(`lists/invalid/${userId}`),
            axios.get(`lists/domain/${userId}`),
            axios.get(`lists/role/${userId}`),
            axios.get(`lists/spam/${userId}`)
        ])
        .then(res => {
            setTotal(res[0].data.data)
            setValid(res[1].data.data)
            setInvalid(res[2].data.data)
            setDomain(res[3].data.data)
            setRole(res[4].data.data)
            setSpam(res[5].data.data)
        })
        .catch(err => {
            console.log(err)
        })
    },[])

    return <Box>
        <Header setisDrawerOpen={setisDrawerOpen} drawerWidth={drawerWidth}/>
        <SideDrawer isDrawerOpen={isDrawerOpen} setisDrawerOpen={setisDrawerOpen} handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth}/>
        <Box  sx={{ p: 4, width: { md: `calc(100% - ${drawerWidth}px)` },ml:{md :`${drawerWidth}px`}}}>
            <Box sx={{display:"flex",flexDirection:"column",minHeight:"82vh"}}>
                <Grid container spacing={2} marginTop={1} marginBottom={4}>
                    <Grid item lg={2} md={4} xs={6}>
                        <Card>
                            <CardHeader subheader={
                                <Typography variant="caption" sx={{fontSize:"0.85em"}}>
                                    TOTAL EMAILS
                                </Typography>
                            }/>
                            <CardContent>
                                <Typography variant="h4" sx={{fontSize:"1.75rem"}}>
                                    {total}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{display:"flex",justifyContent:"end"}}>
                                <IconButton size="small"
                                    sx={{
                                        cursor:"auto",
                                        borderRadius: '50%',
                                        marginRight:"4px",
                                        marginBottom:"4px",
                                        bgcolor: 'teal',
                                        color:"white",
                                        '&:hover': {
                                            bgcolor: 'teal',
                                        }
                                    }}
                                >
                                    <EmailIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item lg={2} md={4} xs={6}>
                        <Card>
                            <CardHeader subheader={
                                <Typography variant="caption" sx={{fontSize:"0.85em"}}>
                                    VALID EMAILS
                                </Typography>
                            }/>
                            <CardContent>
                                <Typography variant="h4" sx={{fontSize:"1.75rem"}}>
                                    {valid}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{display:"flex",justifyContent:"end"}}>
                                <IconButton color="success" size="small"
                                    sx={{
                                        cursor:"auto",
                                        borderRadius: '50%',
                                        marginRight:"4px",
                                        marginBottom:"4px",
                                        bgcolor: 'success.light',
                                        color: 'success.contrastText',
                                        '&:hover': {
                                            bgcolor: 'success.light',
                                        }
                                    }}
                                >
                                    <EmailIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item lg={2} md={4} xs={6}>
                        <Card>
                            <CardHeader subheader={
                                <Typography variant="caption" sx={{fontSize:"0.85em"}}>
                                    INVALID EMAILS
                                </Typography>
                            }/>
                            <CardContent>
                                <Typography variant="h4" sx={{fontSize:"1.75rem"}}>
                                    {invalid}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{display:"flex",justifyContent:"end"}}>
                                <IconButton color="error" size="small"
                                    sx={{
                                        cursor:"auto",
                                        borderRadius: '50%',
                                        marginRight:"4px",
                                        marginBottom:"4px",
                                        bgcolor: 'error.light',
                                        color: 'error.contrastText',
                                        '&:hover': {
                                            bgcolor: 'error.light',
                                        }
                                    }}
                                >
                                    <EmailIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item lg={2} md={4} xs={6}>
                        <Card>
                            <CardHeader subheader={
                                <Typography variant="caption" sx={{fontSize:"0.85em"}}>
                                    DOMAIN EMAILS
                                </Typography>
                            }/>
                            <CardContent>
                                <Typography variant="h4" sx={{fontSize:"1.75rem"}}>
                                    {domain}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{display:"flex",justifyContent:"end"}}>
                                <IconButton color="primary" size="small"
                                    sx={{
                                        cursor:"auto",
                                        borderRadius: '50%',
                                        marginRight:"4px",
                                        marginBottom:"4px",
                                        bgcolor: 'primary.light',
                                        color: 'primary.contrastText',
                                        '&:hover': {
                                            bgcolor: 'primary.light',
                                        }
                                    }}
                                >
                                    <EmailIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item lg={2} md={4} xs={6}>
                        <Card>
                            <CardHeader subheader={
                                <Typography variant="caption" sx={{fontSize:"0.85em"}}>
                                    ROLE EMAILS
                                </Typography>
                            }/>
                            <CardContent>
                                <Typography variant="h4" sx={{fontSize:"1.75rem"}}>
                                    {role}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{display:"flex",justifyContent:"end"}}>
                                <IconButton color="secondary" size="small"
                                    sx={{
                                        cursor:"auto",
                                        borderRadius: '50%',
                                        marginRight:"4px",
                                        marginBottom:"4px",
                                        bgcolor: 'secondary.light',
                                        color: 'secondary.contrastText',
                                        '&:hover': {
                                            bgcolor: 'secondary.light',
                                        }
                                    }}
                                >
                                    <EmailIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item lg={2} md={4} xs={6}>
                        <Card>
                            <CardHeader subheader={
                                <Typography variant="caption" sx={{fontSize:"0.85em"}}>
                                    SPAM EMAILS
                                </Typography>
                            }/>
                            <CardContent>
                                <Typography variant="h4" sx={{fontSize:"1.75rem"}}>
                                    {spam}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{display:"flex",justifyContent:"end"}}>
                                <IconButton color="warning" size="small"
                                    sx={{
                                        cursor:"auto",
                                        borderRadius: '50%',
                                        marginRight:"4px",
                                        marginBottom:"4px",
                                        bgcolor: 'warning.light',
                                        color: 'warning.contrastText',
                                        '&:hover': {
                                            bgcolor: 'warning.light',
                                        }
                                    }}
                                >
                                    <EmailIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
                <Box sx={{width:{xs:'100%',md:'62%'},marginTop:"auto"}}>
                    <Report />
                </Box>
            </Box>
        </Box>
    </Box>
}

export default HomePage