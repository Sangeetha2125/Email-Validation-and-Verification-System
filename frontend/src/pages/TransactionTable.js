import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TableSortLabel, TablePagination, Typography, Chip, CircularProgress, Stack } from "@mui/material"
import Header from "../components/Header"
import SideDrawer from "../components/SideDrawer"
import { useState, useEffect } from "react"
import axios from "axios"

function TransactionTable(){

    const drawerWidth = 240
    const [isLoading, setIsLoading] = useState(true)
    const [isDrawerOpen,setisDrawerOpen] = useState(false)

    const [transactions,setTransactions] = useState([])

    const [count,setCount] = useState(0)
    const [page,setPage] = useState(0)
    const [rowsPerPage,setRowsPerPage] = useState(5)

    const [order,setOrder] = useState('desc')
    const [orderBy,setOrderBy] = useState('id')

    const [emptyTable,setEmptyTable] = useState('')

    useEffect(() => {
        setIsLoading(true)
        axios.get(`transactions`)
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
    },[])

    useEffect(() => {
        if(!localStorage.getItem('token')){
            localStorage.setItem('token','')
        }
        axios.get(`transactions?page=${page+1}&limit=${rowsPerPage}&sort=${orderBy}&sort_type=${order}`)
        .then(res => {
            setEmptyTable('')
            setTransactions(res.data.data.data)
            setCount(res.data.data.total)
        })
        .catch(err => {
            setTransactions([])
            setEmptyTable(err.response.data.message)
        })
    },[page,rowsPerPage,order,orderBy])

    const handleDrawerToggle = () => {
        setisDrawerOpen(!isDrawerOpen)
    }

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

    return (
        <Box>
            <Header setisDrawerOpen={setisDrawerOpen} drawerWidth={drawerWidth}/>
            <SideDrawer isDrawerOpen={isDrawerOpen} setisDrawerOpen={setisDrawerOpen} handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth}/>
            <Box sx={{ p: 1,mt:7,mb:2,ml:{md :`${drawerWidth}px`}}}>
                <TableContainer component={Paper} sx={{m:'auto',maxWidth:{'xs':'95%','md':'90%','lg':'88%'},mt:"3em"}}>
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
                                <TableCell>Email</TableCell>
                                <TableCell>Payment ID</TableCell>
                                <TableCell>Transaction Date</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        {isLoading ?
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Stack display="flex" justifyContent="center" alignItems="center" sx={{ height: '100px' }}>
                                        <CircularProgress />
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        </TableBody> :
                        <TableBody>
                            {
                                transactions.map(transaction => {
                                    return (
                                    <TableRow key={transaction.id}>    
                                        <TableCell>
                                            <Button sx={{color:"black",cursor:"text"}}>{transaction.package}</Button>
                                        </TableCell>
                                        <TableCell>{transaction.email}</TableCell>
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
                        </TableBody>}
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
            </Box>
        </Box>
    )
}

export default TransactionTable