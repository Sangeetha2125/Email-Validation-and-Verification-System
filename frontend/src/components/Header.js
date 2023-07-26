import MenuIcon from '@mui/icons-material/Menu'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Link, useNavigate } from "react-router-dom"
import { AppBar, Toolbar, IconButton, Button, Box, Menu, MenuItem, MenuList } from '@mui/material'
import { useState } from 'react'
import Logo from '../assets/logo.png'
import axios from 'axios'

function Header({setisDrawerOpen,drawerWidth}){

    const [user,setUser] = useState(JSON.parse(localStorage.getItem('current_user')))
    const navigate = useNavigate()

    const [anchor,setAnchor] = useState(null)
    const [openMenu,setOpenMenu] = useState(false)

    const handleClick = (event) => {
        setAnchor(event.currentTarget)
        setOpenMenu(!openMenu)
    }

    const handleMenuClick = () => {
        setOpenMenu(!openMenu)
    }

    const handleLogout = () => {
        axios.post('logout')
        .then(res => {
            localStorage.removeItem('current_user')
            localStorage.removeItem('token')
            setUser(null)
            setAnchor(null)
            setOpenMenu(false)
            navigate('/signin')
        })
        .catch(err => {
            localStorage.removeItem('current_user')
            localStorage.removeItem('token')
            setUser(null)
            setAnchor(null)
            setOpenMenu(false)
            navigate('/signin')
        })
    }

    return (
        <AppBar
            position="static"
            color="inherit"
            sx={{
                padding:"3px",
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
            }}
        >
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: {xs:2, md:0}, display: { xs: 'block', md: 'none' }}}
                    onClick={()=>setisDrawerOpen(true)}
                >
                    <MenuIcon sx={{display: { xs: 'block', md: 'none' }}}/>
                </IconButton>
                <Box sx={{flexGrow:1}}>
                    <img src={Logo} width={140} alt="Logo"/>
                </Box>
                {user && <Button color="inherit" variant="outlined" size="large" startIcon={<AccountCircleIcon color='primary' fontSize='inherit'/>} endIcon={<KeyboardArrowDownIcon />} onClick={(event)=>handleClick(event)}>
                    {user.name}
                </Button>}
            </Toolbar>
            <Menu
                anchorEl={anchor}
                open={openMenu}
                onClick={handleMenuClick}
                transformOrigin={{
                    horizontal:'left',
                    vertical:'top'
                }}
                anchorOrigin={{
                    horizontal:'left',
                    vertical:'bottom'
                }}
            >
                <MenuList disablePadding sx={{width:'200px'}}>
                    <Link to="/profile" className='profile-btn'>
                        <MenuItem>
                            Profile
                        </MenuItem>
                    </Link>
                    <MenuItem onClick={handleLogout}>
                        Logout
                    </MenuItem>
                </MenuList>
            </Menu>
        </AppBar>
    )
}

export default Header