import { Box, Button, LinearProgress, Stack, TableCell, TableRow, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import ArticleIcon from '@mui/icons-material/Article'

function ListRow({data,takeDeleteId,showListResults}){

    const [list,setList] = useState(data)
    
    const updateProgress = (listid) => {
        axios.get(`lists/${listid}`)
        .then(res => {
            setList(res.data.data)
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        if(list){
            const intervalId = setInterval(() => {
            if (list.status === 'processing') {
                updateProgress(list.id)
            }
            }, 60000)
            return () => clearInterval(intervalId)
        }
        // eslint-disable-next-line
    },[list])

    return (
        list ? (
        <TableRow key={list.id}>    
            <TableCell>
                <Link to={`http://${list.file_path}`}>
                    <Button sx={{color:"black"}}>{list.name}</Button>
                </Link>
            </TableCell>
            <TableCell>{list.total}</TableCell>
            <TableCell sx={{paddingRight:"10px",width:"225px"}}>
                <Stack direction="column" spacing={0.7}>
                    <Typography>{list.status}</Typography>
                    {list.status==='processing' && 
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{width:"100%"}}>
                            <LinearProgress variant="determinate" value={list.total===0 ? 0 : (list.progress/list.total)*100}/>
                        </Box>
                        <Typography variant="body2">{list.total===0 ? 0 : Math.round((list.progress/list.total)*100)}%</Typography>
                    </Stack> }
                </Stack>
            </TableCell>
            <TableCell sx={{padding:"16px 0px"}}>
                <Stack direction="row" spacing={1} justifyContent="center">
                    {list.status==="completed" ? <Button id={list.id} variant="outlined" color="success" startIcon={<ArticleIcon />} onClick={() => showListResults(list.id,list.name)}>Results</Button> : <Button id={list.id} variant="outlined" color="success" startIcon={<ArticleIcon />} disabled>Results</Button>}
                    <Button id={list.id} variant="outlined" color="error" endIcon={<DeleteOutlineOutlinedIcon />} onClick={takeDeleteId} >Delete</Button>
                </Stack>
            </TableCell>
        </TableRow>) : <></>
    )
}
export default ListRow