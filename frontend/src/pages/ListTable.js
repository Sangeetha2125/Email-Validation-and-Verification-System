import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import Header from "../components/Header"
import SideDrawer from "../components/SideDrawer"
import AddIcon from '@mui/icons-material/Add'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import CloseIcon from '@mui/icons-material/Close'
import ListResultsDrawer from "../components/ListResultsDrawer"
import axios from "axios"
import { DropzoneArea } from 'material-ui-dropzone'
import ListRow from "../components/ListRow"

function ListTable(){

    const drawerWidth = 240
    const [isLoading, setIsLoading] = useState(true)
    const [isDrawerOpen,setisDrawerOpen] = useState(false)

    const [lists,setLists] = useState([])
    const [openDialog,setOpenDialog] = useState(false)

    const [count,setCount] = useState(0)
    const [page,setPage] = useState(0)
    const [rowsPerPage,setRowsPerPage] = useState(5)

    const [order,setOrder] = useState('desc')
    const [orderBy,setOrderBy] = useState('id')

    const [emptyTable,setEmptyTable] = useState('')

    const [name,setName] = useState('')
    const [filePath,setFilePath] = useState("")
    const [isNameValid,setIsNameValid] = useState(true)
    const [errorName,setErrorName] = useState('')
    const [showAlert,setShowAlert] = useState(false)
    const [showDeleteDialog,setShowDeleteDialog] = useState(false)
    const [deleteid ,setDeleteid] = useState()

    const [openListDrawer,setOpenListDrawer] = useState(false)
    const [listResults,setListResults] = useState({})
    const [processing,setProcessing] = useState(false)

    const fetchLists = () => {
        const user_id = JSON.parse(localStorage.getItem('current_user')).id
        
        axios.get(`/lists?page=${page+1}&limit=${rowsPerPage}&sort=${orderBy}&sort_type=${order}&user=${user_id}`)
        .then(res => {
            setEmptyTable('')
            setLists(res.data.data.data)
            setCount(res.data.data.total)
        })
        .catch(err => {
            setLists([])
            setEmptyTable(err.response.data.message)
        })
    }

    useEffect(() => {
        setIsLoading(true)
        const user_id = JSON.parse(localStorage.getItem('current_user')).id
        axios.get(`lists?user=${user_id}`)
        .then(res => {
            setEmptyTable('')
            setLists(res.data.data.data)
            setCount(res.data.data.total)
        })
        .catch(err => {
            setLists([])
            setEmptyTable(err.response.data.message)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    },[])

    useEffect(() => {
        fetchLists()
        // eslint-disable-next-line
    },[page,rowsPerPage,order,orderBy,showAlert])

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

    const handleSubmit = (event) => {
        event.preventDefault()
        setProcessing(true)

        const user_id = parseInt(JSON.parse(localStorage.getItem('current_user')).id)
        const FormData = require("form-data")
        const data = new FormData()
        data.append("name",name)
        data.append("file", filePath)
        data.append("user_id",user_id)

        axios({
            method:'post',
            url:`${process.env.REACT_APP_API_URL}/lists`,
            data:data,
            headers:{
                "Content-Type":"multipart/form-data",
                "Authorization":"Bearer "+localStorage.getItem('token')
            }
        })
        .then(res => {
            localStorage.setItem('alertMessage',res.data.message)
            setOpenDialog(false)
            setShowAlert(true)
            resetForm()
        })
        .catch(err => {
            const errors = err.response.data.message

            if(errors.hasOwnProperty('name')){
                setIsNameValid(false)
                setErrorName(errors.name)
            }
            else{
                setIsNameValid(true)
                setErrorName('')
            }
        })
        .finally(()=>{
            setProcessing(false)
        })
    }

    const resetForm = () => {
        setOpenDialog(false)
        setIsNameValid(true)
        setName('')
        setFilePath('')
        setErrorName('')
    }

    const takeDeleteId = (event) => {
        let id = event.target.id
        setDeleteid(id)
        setShowDeleteDialog(true)
    }

    const handleDelete = (event) => {
        axios.delete(`/lists/${event.target.id}/delete`)
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

    const showListResults = (listId,listName) => {
        axios.get(`/lists/results/${listId}`)
        .then(res => {
            setListResults({'name':listName,'results':res.data.data})
            setOpenListDrawer(true)
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <Box>
            <Header setisDrawerOpen={setisDrawerOpen} drawerWidth={drawerWidth}/>
            <SideDrawer isDrawerOpen={isDrawerOpen} setisDrawerOpen={setisDrawerOpen} handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth}/>
            <ListResultsDrawer openListDrawer={openListDrawer} setOpenListDrawer={setOpenListDrawer} listResults={listResults}/>
            <Snackbar open={showAlert} onClose={handleAlertClose} anchorOrigin={{vertical:'top',horizontal:'right'}} autoHideDuration={3000}>
                <Alert severity="success" onClose={handleAlertClose}>
                    {localStorage.getItem('alertMessage')}
                </Alert>
            </Snackbar>
            <Dialog open={showDeleteDialog} onClose={()=>setShowDeleteDialog(false)} fullWidth>
                <DialogTitle>Are you sure to delete the list?</DialogTitle>
                <DialogContent>
                    <DialogActions>
                        <Button id={deleteid} variant="contained" color="error" onClick={handleDelete}>Yes</Button>
                        <Button variant="contained" color="success" onClick={() => setShowDeleteDialog(false)}>No</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <Box sx={{ p: 1,mt:3.5,mb:2,ml:{md :`${drawerWidth}px`}}}>
                <Dialog open={openDialog} component="form" encType="multipart/form-data" onSubmit={(event)=>handleSubmit(event)} noValidate autoComplete="off" fullWidth>
                    <DialogTitle variant="h5">
                        Add New List
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
                                <TextField margin="dense" type="email" label="Enter Name" value={name} error={!isNameValid} helperText={!isNameValid && errorName} onChange={(event)=>setName(event.target.value)} fullWidth />
                            </Grid>
                            <Grid item  xs={12}>
                            <DropzoneArea
                                acceptedFiles={['.txt','.csv']}
                                showPreviews={true}
                                showPreviewsInDropzone={false}
                                useChipsForPreview
                                filesLimit={1}
                                previewGridProps={{container: {spacing: 1, direction: 'row'}}}
                                previewText="Selected File"
                                showAlerts={false}
                                maxFileSize={9000000000000}
                                onChange={(files)=>setFilePath(files[0])}
                            />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Divider />
                    <DialogActions sx={{margin:"0.5em"}}>
                        <Button type="submit" variant="outlined" color="inherit" endIcon={<SaveOutlinedIcon />} disabled={processing}>Save List</Button>
                    </DialogActions>
                </Dialog>
                <Stack alignItems="end" justifyItems="center" sx={{m:'auto',maxWidth:'1000px'}}>
                    <Button variant="contained" color="success" endIcon={<AddIcon />} onClick={() => {
                        setOpenDialog(true)
                    }}>Add New</Button>
                </Stack>
                <TableContainer component={Paper} sx={{m:'auto',width:"1000px",maxWidth:'94%',mt:"2.5em"}}>
                    <Table stickyHeader sx={{minWidth:'850px'}}>
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
                                <TableCell>Total</TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'status'}
                                        direction={orderBy === 'status' ? order : 'asc'}
                                        onClick={()=> createSortHandler('status')}
                                    >
                                        Status
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        {isLoading ?
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Stack display="flex" justifyContent="center" alignItems="center" sx={{ height: '100px' }}>
                                        <CircularProgress />
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        </TableBody> :
                        <TableBody>
                            {
                                lists.map(list => {
                                    return (<ListRow key={list.id} data={list} takeDeleteId={takeDeleteId} showListResults={showListResults}/>)
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

export default ListTable