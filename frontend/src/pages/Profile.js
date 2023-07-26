import { Box, Button, Chip, Divider, Grid, List, ListItem, ListItemButton, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel, Tabs, Typography } from "@mui/material"
import Header from "../components/Header"
import SideDrawer from "../components/SideDrawer"
import { useEffect, useState } from "react"
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import PersonIcon from '@mui/icons-material/Person'
import PaymentIcon from '@mui/icons-material/Payment'
import axios from "axios"
import CircularLoader from "../components/CircularLoader"

function Profile(){
    const drawerWidth = 240
    const [isLoading, setIsLoading] = useState(true)
    const [isDrawerOpen,setisDrawerOpen] = useState(false)
    const [tab,setTab] = useState('profile')
    const [user,setUser] = useState(null)
    const [transactions,setTransactions] = useState(null)

    const [count,setCount] = useState(0)
    const [page,setPage] = useState(0)
    const [rowsPerPage,setRowsPerPage] = useState(5)

    const [order,setOrder] = useState('asc')
    const [orderBy,setOrderBy] = useState('package')

    const [emptyTable,setEmptyTable] = useState('')

    useEffect(()=>{
        setIsLoading(true)
        const id = JSON.parse(localStorage.getItem('current_user')).id
        axios.get(`users/${id}`)
        .then(res => {
            setUser(res.data.data)
        })
        .catch(err => {
           console.log(err) 
        })

        const email = JSON.parse(localStorage.getItem('current_user')).email
        axios.get(`transactions/${email}/all?page=${page+1}&limit=${rowsPerPage}&sort=${orderBy}&sort_type=${order}`)
        .then(res => {
            setEmptyTable('')
            setTransactions(res.data.data.data)
            setCount(res.data.data.total)
        })
        .catch(err => {
            setTransactions([])
            setEmptyTable(err.response.data.message)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    },[page,rowsPerPage,order,orderBy])

    const handlePageChange = (event,newPage) => {
        setPage(newPage)
    }

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value,10))
        setPage(0)
    }

    const createSortHandler = (field) => {
        if(order==='asc'){
            setOrder('desc')
            setOrderBy(field)
        }
        else if(order==='desc'){
            setOrder('asc')
            setOrderBy(field)
        }
    }

    const handleDrawerToggle = () => {
        setisDrawerOpen(!isDrawerOpen)
    }

    const handleTabChange = (event,newValue) => {
        setTab(newValue)
    }

    return (
        <Box>
            <Header setisDrawerOpen={setisDrawerOpen} drawerWidth={drawerWidth}/>
            <SideDrawer isDrawerOpen={isDrawerOpen} setisDrawerOpen={setisDrawerOpen} handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth}/>
            <Box sx={{ p: 1,mt:7.5,mb:2,ml:{md :`${drawerWidth}px`}}}>
            {isLoading ?
                 <CircularLoader /> :
                <Box component={Paper} sx={{m:"auto",width:"1180px",maxWidth:"94%"}}>
                    <TabContext value={tab}>
                        <Tabs
                            value={tab}
                            onChange={handleTabChange}
                            textColor="primary"
                            indicatorColor="primary"
                            variant="fullWidth"
                        >
                            <Tab value="profile" label="Profile" icon={<PersonIcon />} iconPosition="start"/>
                            <Tab value="transactions" label="Transactions" icon={<PaymentIcon />} iconPosition="start"/>
                        </Tabs>
                        <TabPanel value="profile">
                            <List>
                                <ListItem>
                                    <ListItemButton sx={{cursor:"auto"}}>
                                        <Grid container>
                                            <Grid item xs={12} md={6}>
                                                Name
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                {user && user.name}
                                            </Grid>
                                        </Grid>
                                    </ListItemButton>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemButton sx={{cursor:"auto"}}>
                                        <Grid container>
                                            <Grid item xs={12} md={6}>
                                                Email ID
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                {user && user.email}
                                            </Grid>
                                        </Grid>
                                    </ListItemButton>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemButton sx={{cursor:"auto"}}>
                                        <Grid container>
                                            <Grid item xs={12} md={6}>
                                                Role
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                {user && user.role[0].toUpperCase() + user.role.slice(1)}
                                            </Grid>
                                        </Grid>
                                    </ListItemButton>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemButton sx={{cursor:"auto"}}>
                                        <Grid container>
                                            <Grid item xs={12} md={6}>
                                                Status
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                {user && user.status[0].toUpperCase() + user.status.slice(1)}
                                            </Grid>
                                        </Grid>
                                    </ListItemButton>
                                </ListItem>
                                <Divider />
                            </List>
                        </TabPanel>
                        <TabPanel value="transactions">
                            <TableContainer sx={{m:'auto',mt:"1.5em"}}>
                                <Table stickyHeader sx={{minWidth:"500px"}}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'package'}
                                                    direction={orderBy === 'package' ? order : 'asc'}
                                                    onClick={()=> createSortHandler('package')}
                                                >
                                                    Package
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>Payment ID</TableCell>
                                            <TableCell>Transaction Date</TableCell>
                                            <TableCell>Start Date</TableCell>
                                            <TableCell>End Date</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            transactions && transactions.map(transaction => {
                                                return (
                                                <TableRow key={transaction.id}>    
                                                    <TableCell>
                                                        <Button sx={{color:"black",cursor:"text"}}>{transaction.package}</Button>
                                                    </TableCell>
                                                    <TableCell>{transaction.payment_id}</TableCell>
                                                    <TableCell>{(new Date(transaction.transaction_date)).toDateString()}</TableCell>
                                                    <TableCell>{(new Date(transaction.start_date)).toDateString()}</TableCell>
                                                    <TableCell>{(new Date(transaction.end_date)).toDateString()}</TableCell>
                                                    <TableCell>
                                                        {transaction?.status==='active' ? 
                                                        <Chip label={transaction.status} color="success" variant="outlined" size='small' /> :
                                                        <Chip label={transaction.status} color="error" variant="outlined" size='small' />}
                                                    </TableCell>
                                                </TableRow>)
                                            })
                                        }
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            {emptyTable === "" ? 
                                            <TablePagination
                                                page={page}
                                                count={count}
                                                rowsPerPageOptions={[5,10,15]}
                                                rowsPerPage={rowsPerPage}
                                                onPageChange={handlePageChange}
                                                onRowsPerPageChange={handleRowsPerPageChange}
                                            /> : 
                                            <TableCell colSpan={7} sx={{textAlign:"center"}}>
                                                <Typography variant="body2" sx={{color:"grey"}}>
                                                    {emptyTable}
                                                </Typography>
                                            </TableCell>}
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                        </TabPanel>
                    </TabContext>
                </Box>
            }
            </Box>
        </Box>
    )
}

export default Profile