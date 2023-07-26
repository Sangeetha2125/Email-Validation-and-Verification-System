import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, IconButton, InputLabel, Menu, MenuItem, Paper, Select, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import Header from "../components/Header"
import SideDrawer from "../components/SideDrawer"
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddIcon from '@mui/icons-material/Add'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import CloseIcon from '@mui/icons-material/Close'
import axios from "axios"

function UserTable(){

    const drawerWidth = 240
    const [isLoading, setIsLoading] = useState(true)
    const [isDrawerOpen,setisDrawerOpen] = useState(false)

    const [users,setUsers] = useState([])

    const [count,setCount] = useState(0)
    const [page,setPage] = useState(0)
    const [rowsPerPage,setRowsPerPage] = useState(5)

    const [order,setOrder] = useState('asc')
    const [orderBy,setOrderBy] = useState('name')

    const [emptyTable,setEmptyTable] = useState('')

    const [showAlert,setShowAlert] = useState(false)
    const [showDeleteDialog,setShowDeleteDialog] = useState(false)
    const [deleteid,setDeleteid] = useState()

    const [userId,setUserId] = useState('')
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [status,setStatus] = useState('active')
    const [role,setRole] = useState('single')

    const [openDialog,setOpenDialog] = useState(false)
    const [openCreateDialog,setOpenCreateDialog] = useState(false)
    const [anchor,setAnchor] = useState(null)
    const [openFilter,setOpenFilter] = useState(false)
    const [filterStatus,setFilterStatus] = useState('all')
    const [processing,setProcessing] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        axios.get(`users`)
        .then(res => {
            setEmptyTable('')
            setUsers(res.data.data.data)
            setCount(res.data.data.total)
        })
        .catch(err => {
            setUsers([])
            setEmptyTable(err.response.data.message)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    },[])
 
    useEffect(() => {
        axios.get(`users?page=${page+1}&limit=${rowsPerPage}&sort=${orderBy}&sort_type=${order}&filter=${filterStatus}`)
        .then(res => {
            setEmptyTable('')
            setUsers(res.data.data.data)
            setCount(res.data.data.total)
        })
        .catch(err => {
            setUsers([])
            setEmptyTable(err.response.data.message)
        })
    },[page,rowsPerPage,order,orderBy,showAlert,filterStatus])

    const handleCreateSubmit = (event) => {
        event.preventDefault()
        setProcessing(true)
        let credentials = {name:name,email:email,password:password,status:status,role:role}
        axios.post('users',credentials)
        .then(res => {
            localStorage.setItem('alertMessage',res.data.message)
            setShowAlert(true)
        })
        .catch(err => {
            console.log(err)
        })
        .finally(()=>{
            resetForm()
            setProcessing(false)
        })
    }

    const handleEditSubmit = (event) => {
        event.preventDefault()
        setProcessing(true)
        let credentials = {name:name,email:email,status:status,role:role}

        axios.put(`users/${event.target.id}/edit`,credentials)
        .then(res => {
            localStorage.setItem('alertMessage',res.data.message)
            setShowAlert(true)
        })
        .catch(err => {
            console.log(err)
        })
        .finally(()=>{
            resetForm()
            setProcessing(false)
        })
    }

    const handleEdit = (event) => {
        let itemId = event.target.id
        if(itemId!==''){
            axios.get(`users/${itemId}/edit`)
            .then(res => {
                const response = res.data.data
                setName(response.name)
                setEmail(response.email)
                setStatus(response.status)
                setRole(response.role)
                setUserId(response.id)
                setOpenDialog(true)
            })
            .catch(err => console.log(err))
        }
    }

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
    
    const takeDeleteId = (event) => {
        let id = event.target.id
        setDeleteid(id)
        setShowDeleteDialog(true)
    }

    const handleDelete = (event) => {
        axios.delete(`/users/${event.target.id}/delete`)
        .then(res => {
            localStorage.setItem('alertMessage',res.data.message)
            setShowDeleteDialog(false)
            setShowAlert(true)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const handleAlertClose = () => {
        setShowAlert(false)
        localStorage.removeItem('alertMessage')
    }

    const handleClose = () => {
        setOpenDialog(false)
    }

    const handleCreateClose = () => {
        setOpenCreateDialog(false)
    }

    const resetForm = () => {
        setOpenDialog(false)
        setOpenCreateDialog(false)
        setName('')
        setPassword('')
        setEmail('')
    }

    const handleFilterClick = (event) => {
        setAnchor(event.currentTarget)
        setOpenFilter(!openFilter)
    }

    const handleFilterMenuClose = () => {
        setAnchor(null)
    }

    return (
        <Box>
            <Header setisDrawerOpen={setisDrawerOpen} drawerWidth={drawerWidth}/>
            <SideDrawer isDrawerOpen={isDrawerOpen} setisDrawerOpen={setisDrawerOpen} handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth}/>
            <Snackbar open={showAlert} onClose={handleAlertClose} anchorOrigin={{vertical:'top',horizontal:'right'}} autoHideDuration={3000}>
                <Alert severity="success" onClose={handleAlertClose}>
                    {localStorage.getItem('alertMessage')}
                </Alert>
            </Snackbar>
            <Dialog open={showDeleteDialog} onClose={()=>setShowDeleteDialog(false)} fullWidth>
                <DialogTitle>Are you sure to delete the user?</DialogTitle>
                <DialogContent>
                    <DialogActions>
                        <Button id={deleteid} variant="contained" color="error" onClick={handleDelete}>Yes</Button>
                        <Button variant="contained" color="success" onClick={() => setShowDeleteDialog(false)}>No</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <Box sx={{ p: 1,mt:3.5,mb:2,ml:{md :`${drawerWidth}px`}}}>
                <Dialog open={openDialog} onClose={handleClose} id={userId} component="form" onSubmit={(event)=>handleEditSubmit(event)} noValidate autoComplete="off" fullWidth>
                    <DialogTitle variant="h5">
                        Edit User
                        <IconButton
                            onClick={resetForm}
                            sx={{
                                position: 'absolute',
                                right: 10,
                                top: 10,
                                color: "grey"
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <Grid container spacing={1.5}>
                            <Grid item  xs={12}>
                                <TextField margin="dense" type="text" label="Enter Name" value={name} onChange={(event)=>setName(event.target.value)} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField margin="dense" type="email" label="Enter Email" value={email} onChange={(event)=>setEmail(event.target.value)} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl margin="dense" fullWidth>
                                    <InputLabel>Select Status</InputLabel>
                                    <Select label="Select Status" value={status} onChange={(event)=>setStatus(event.target.value)} fullWidth>
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="blocked">Blocked</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl margin="dense" fullWidth>
                                    <InputLabel>Select Role</InputLabel>
                                    <Select label="Select Role" value={role} onChange={(event)=>setRole(event.target.value)} fullWidth>
                                        <MenuItem value="single">Single</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Divider />
                    <DialogActions sx={{margin:"0.5em"}}>
                        <Button type="submit" variant="outlined" color="inherit" onClick={handleClose} endIcon={<UpdateOutlinedIcon />} disabled={processing}>Update User</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openCreateDialog} onClose={handleCreateClose} id={userId} component="form" onSubmit={(event)=>handleCreateSubmit(event)} noValidate autoComplete="off" fullWidth>
                    <DialogTitle variant="h5">
                        Add New User
                        <IconButton
                            onClick={resetForm}
                            sx={{
                                position: 'absolute',
                                right: 10,
                                top: 10,
                                color: "grey"
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <Grid container spacing={1.5}>
                            <Grid item  xs={12}>
                                <TextField margin="dense" type="text" label="Enter Name" value={name} onChange={(event)=>setName(event.target.value)} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField margin="dense" type="email" label="Enter Email" value={email} onChange={(event)=>setEmail(event.target.value)} fullWidth />
                            </Grid>
                            <Grid item  xs={12}>
                                <TextField margin="dense" type="password" label="Enter Password" value={password} onChange={(event)=>setPassword(event.target.value)} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl margin="dense" fullWidth>
                                    <InputLabel>Select Status</InputLabel>
                                    <Select label="Select Status" value={status} onChange={(event)=>setStatus(event.target.value)} fullWidth>
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="blocked">Blocked</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl margin="dense" fullWidth>
                                    <InputLabel>Select Role</InputLabel>
                                    <Select label="Select Role" value={role} onChange={(event)=>setRole(event.target.value)} fullWidth>
                                        <MenuItem value="single">Single</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Divider />
                    <DialogActions sx={{margin:"0.5em"}}>
                        <Button type="submit" variant="outlined" color="inherit" onClick={handleCreateClose} endIcon={<SaveOutlinedIcon />} disabled={processing}>Save User</Button>
                    </DialogActions>
                </Dialog> 
                <Stack direction="row" justifyContent="space-between" justifyItems="center" sx={{m:'auto',mt:'2em',maxWidth:{'xs':'90%','md':'85%','lg':'74%'}}}>
                    <Button variant="outlined" color="inherit" onClick={(event) => handleFilterClick(event)} startIcon={<FilterListIcon />} id={filterStatus}>Filter By Status ({filterStatus})</Button>
                    <Menu
                        anchorEl={anchor}
                        open={openFilter}
                        onClick={()=>{setOpenFilter(!openFilter)}}
                        transformOrigin={{
                            horizontal:'left',
                            vertical:'top'
                        }}
                        anchorOrigin={{
                            horizontal:'left',
                            vertical:'bottom'
                        }}
                    >
                        <MenuItem onClick={() => {
                            setFilterStatus('all')
                            handleFilterMenuClose()
                        }}>
                            All
                        </MenuItem>
                        <MenuItem onClick={() => {
                            setFilterStatus('active')
                            handleFilterMenuClose()
                        }}>
                            Active
                        </MenuItem>
                        <MenuItem onClick={() => {
                            setFilterStatus('blocked')
                            handleFilterMenuClose()
                        }}>
                            Blocked
                        </MenuItem>
                    </Menu>
                    <Button variant="contained" color="success" endIcon={<AddIcon />} onClick={()=>{
                        resetForm()
                        setOpenCreateDialog(true)
                    }}>Add New</Button>
                </Stack>
                <TableContainer component={Paper} sx={{m:'auto',maxWidth:{'xs':'90%','md':'85%','lg':'74%'},mt:"2em"}}>
                    <Table stickyHeader sx={{minWidth:"500px"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'name'}
                                        direction={orderBy === 'name' ? order : 'asc'}
                                        onClick={()=> createSortHandler('name')}
                                    >
                                        Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        {isLoading ?
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <Stack display="flex" justifyContent="center" alignItems="center" sx={{ height: '100px' }}>
                                        <CircularProgress />
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        </TableBody> :
                        <TableBody>
                            {
                                users.map(user => {
                                    return (
                                    <TableRow key={user.id}>    
                                        <TableCell>
                                            <Button sx={{color:"black",cursor:"text"}}>{user.name}</Button>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.status}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} justifyContent="center">
                                                <Button id={user.id} variant="outlined" color="info" endIcon={<EditOutlinedIcon />} onClick={handleEdit}>Edit</Button>
                                                <Button id={user.id} variant="outlined" color="error" endIcon={<DeleteOutlineOutlinedIcon />} onClick={takeDeleteId}>Delete</Button>
                                            </Stack>
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
                                <TableCell colSpan={5} sx={{textAlign:"center"}}>
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

export default UserTable