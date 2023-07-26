import { Button, Divider, Drawer, IconButton, List, ListItem, ListItemText, Toolbar, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import CloseIcon from '@mui/icons-material/Close'
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js/auto"

function ListResultsDrawer({openListDrawer,setOpenListDrawer,listResults}){

    ChartJS.register(ArcElement, Tooltip, Legend)

    const name = listResults.name || null
    const results = listResults.results || null
    const data = {
        labels : ['Valid','Invalid','Domain','Role','Spam'],
        datasets : [{
            label : "Path Count",
            data : results && [results.valid_count,results.invalid_count,results.domain_count,results.role_count,results.spam_count],
            backgroundColor : [
                "rgb(27, 190, 27)",
                "rgb(232, 34, 34)",
                "rgb(34, 121, 220)",
                "rgb(171, 0, 171)",
                "rgb(249, 112, 39)"
            ],
            borderColor: "white",
            borderWidth:"0.5"
        }]
    }

    return (
        <Drawer 
            variant="persistent" 
            anchor="right"
            open={openListDrawer} 
            sx={{
                '& .MuiDrawer-paper': { 
                    boxSizing: 'border-box',
                }
            }}
        >
            <Toolbar 
                disableGutters
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: "5.5px",
                    marginRight: "6px"
                }}
            >
                <IconButton onClick={()=>setOpenListDrawer(false)}>
                    <CloseIcon fontSize="inherit"/>
                </IconButton>
            </Toolbar>
            <Divider />
            <List sx={{pl:"1em",pr:"1em"}}>
                <ListItem sx={{mt:"0.25em"}}>
                    <ListItemText sx={{textAlign:"center"}}>
                        <Typography variant="h6">
                            {name && name} - Results
                        </Typography>
                    </ListItemText>
                </ListItem>
                <ListItem sx={{mt:"0.25em"}}>
                    {results && <Link to={`http://${results.valid_path}`} style={{display:"block",width:"100%"}}>
                        <Button variant="outlined" color="success" fullWidth>
                            <ListItemText>Valid Count ({results.valid_count})</ListItemText>
                        </Button>
                    </Link>}
                </ListItem>
                <ListItem sx={{mt:"0.25em"}}>
                    {results && <Link to={`http://${results.invalid_path}`} style={{display:"block",width:"100%"}}>
                        <Button variant="outlined" color="error" fullWidth>
                            <ListItemText>Invalid Count ({results.invalid_count})</ListItemText>
                        </Button>
                    </Link>}
                </ListItem>
                <ListItem sx={{mt:"0.25em"}}>
                    {results && <Link to={`http://${results.domain_path}`} style={{display:"block",width:"100%"}}>
                        <Button variant="outlined" color="primary" fullWidth>
                            <ListItemText>Domain Count ({results.domain_count})</ListItemText>
                        </Button>
                    </Link>}
                </ListItem>
                <ListItem sx={{mt:"0.25em"}}>
                    {results && <Link to={`http://${results.role_path}`} style={{display:"block",width:"100%"}}>
                        <Button variant="outlined" color="secondary" fullWidth>
                            <ListItemText>Role Count ({results.role_count})</ListItemText>
                        </Button>
                    </Link>}
                </ListItem>
                <ListItem sx={{mt:"0.25em"}}>
                    {results && <Link to={`http://${results.spam_path}`} style={{display:"block",width:"100%"}}>
                        <Button variant="outlined" color="warning" fullWidth>
                            <ListItemText>Spam Count ({results.spam_count})</ListItemText>
                        </Button>
                    </Link>}
                </ListItem>
                <ListItem sx={{mt:"0.75em"}}>
                    {results && <Pie data={data}/>}
                </ListItem>
            </List>
        </Drawer>
    )
}

export default ListResultsDrawer