import { IconButton, Toolbar, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, ListItemButton, Button, Typography, Chip, Paper } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import SubscriptionsIcon from '@mui/icons-material/Subscriptions'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import PeopleIcon from '@mui/icons-material/People'
import PaymentIcon from '@mui/icons-material/Payment'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

function SideDrawer({isDrawerOpen,setisDrawerOpen,handleDrawerToggle,drawerWidth,window}){

    const [subscription,setSubscription] = useState()
    const [remainingDays,setRemainingDays] = useState()

    useEffect(() => {
        const email = JSON.parse(localStorage.getItem('current_user')).email
        if(localStorage.getItem('current_user')){
            axios.get(`transactions/${email}`)
            .then(res => {
                setSubscription(res.data.data)
                
                const startDate = new Date()
                const endDate = new Date(res.data.data.end_date)

                const differenceMs = endDate.getTime() - startDate.getTime()
                setRemainingDays(Math.round(differenceMs / (1000 * 60 * 60 * 24)))
            })
            .catch(err => {
                setSubscription()
            })
        }
    },[])
    const drawer = (
        <>
            <Toolbar 
                disableGutters
                sx={{
                    marginRight:"3px",
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: "5.5px"
                }}
            >
                <IconButton onClick={()=>setisDrawerOpen(false)} size="large" sx={{display:{md:'none'}}}>
                    <ChevronLeftIcon fontSize="inherit"/>
                </IconButton>
            </Toolbar>
            <Divider />
            <List className='drawer-nav'>
                <ListItem component={Link} to="/">
                    <ListItemButton>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard"/>
                    </ListItemButton>
                </ListItem>
                <ListItem component={Link} to="/lists">
                    <ListItemButton>
                        <ListItemIcon>
                            <FormatListBulletedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Lists"/>
                    </ListItemButton>
                </ListItem>
                <ListItem component={Link} to="/users">
                    <ListItemButton>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Users"/>
                    </ListItemButton>
                </ListItem>
                <ListItem component={Link} to='/subscribe'>
                    <ListItemButton>
                        <ListItemIcon>
                            <SubscriptionsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Subscribe"/>
                    </ListItemButton>
                </ListItem>
                <ListItem component={Link} to='/transactions'>
                    <ListItemButton>
                        <ListItemIcon>
                            <PaymentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Transactions"/>
                    </ListItemButton>
                </ListItem>
            </List>
            {subscription && <Paper variant='outlined' sx={{margin:"1em",marginTop:"auto",marginBottom:"1.5em"}}>
                <Box pl={1.2} pr={1.2} pt={1.5} pb={1.5}>
                    <Button size='large' sx={{cursor:"auto"}}>{subscription.package}</Button>
                    {subscription.status === "active" &&
                    <Chip label={subscription.status} color="success" variant="outlined" size='small' />
                    }
                    {subscription.status === "inactive" &&
                    <Chip label={subscription.status} color="error" variant="outlined" size='small'/>
                    }
                    <Typography pl={1.5} variant='body2' color="GrayText">{remainingDays} days left</Typography>
                </Box>
            </Paper>}
        </>
    )

    const container = window !== undefined ? () => window().document.body : undefined

    return (
        <Box>
            <Drawer 
                container={container}
                variant="persistent"
                open={isDrawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer 
                variant='permanent'
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
        </Box>
    )
}

export default SideDrawer