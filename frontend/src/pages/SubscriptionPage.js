import { Box } from "@mui/material"
import Header from "../components/Header"
import SideDrawer from "../components/SideDrawer"
import { useState } from "react"
import BuyCredits from "../components/BuyCredits"

function SubscriptionPage(){

    const drawerWidth = 240
    const [isDrawerOpen,setisDrawerOpen] = useState(false)

    const handleDrawerToggle = () => {
        setisDrawerOpen(!isDrawerOpen)
    }

    return (
        <Box>
            <Header setisDrawerOpen={setisDrawerOpen} drawerWidth={drawerWidth}/>
            <SideDrawer isDrawerOpen={isDrawerOpen} setisDrawerOpen={setisDrawerOpen} handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth}/>
            <Box sx={{ p: 1,mt:6.5,mb:2,ml:{md :`${drawerWidth}px`}}}>
                <BuyCredits />
            </Box>
        </Box>
    )
}

export default SubscriptionPage