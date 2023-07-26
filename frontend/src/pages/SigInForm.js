import { Avatar, Stack, TextField, Container, Typography, FormControlLabel, Button, Alert, Snackbar} from "@mui/material"
import PersonIcon from '@mui/icons-material/Person'
import { blue } from "@mui/material/colors"
import Checkbox from '@mui/material/Checkbox'
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton"
import LoginIcon from '@mui/icons-material/Login'
import axios from "axios"

function SignInForm(){

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const [errorEmail,setErrorEmail] = useState('')
    const [errorPassword,setErrorPassword] = useState('')

    const [isEmailValid,setIsEmailValid] = useState(true)
    const [isPasswordValid,setIsPasswordValid] = useState(true)
    
    const [isValidLogin,setIsValidLogin] = useState(true)
    const [open,setOpen] = useState(false)
    const [loading,setLoading] = useState(false)

    const navigate = useNavigate()

    const handleError =(error) => {
        const valid = error.valid
        const auth = error.auth
        setLoading(false)

        if(valid && (valid.hasOwnProperty('email') || valid.hasOwnProperty('password'))){
            if(valid.hasOwnProperty('email')){
                setErrorEmail(valid.email[0])
                setIsEmailValid(false)
            }
            else{
                setIsEmailValid(true) 
            }
            if(valid.hasOwnProperty('password')){
                setErrorPassword(valid.password[0])
                setIsPasswordValid(false)
            }
            else{
                setIsPasswordValid(true)
            }
        }
        else if(auth==="Invalid Credentials"){
            setIsEmailValid(true) 
            setIsPasswordValid(true)
            setIsValidLogin(false)
            setShowAlert(false)
        }
    }

    const handleLogin = (res) => {
        if(res.data.message==="Logged in successfully"){
            localStorage.setItem('token',res.data.data.authorisation.token)
            localStorage.setItem('current_user',JSON.stringify(res.data.data.user))
            axios.defaults.headers.common['Authorization'] = "Bearer " +localStorage.getItem('token')
            setIsEmailValid(true) 
            setIsPasswordValid(true)
            setIsValidLogin(true)
            setLoading(false)
            setOpen(true)
        }
    }

    const handleClose = () =>{
        setShowAlert(false)
        localStorage.setItem('showMessage',false)
        navigate('/')
        setOpen(false)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setLoading(true)
        let credentials = {email,password}

        axios({
            method:'post',
            url: `${process.env.REACT_APP_API_URL}/login`,
            data:JSON.stringify(credentials),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then(res => handleLogin(res))
        .catch(err => handleError({"valid":err.response.data.errors,"auth":err.response.data.message}))
    }

    const [showAlert,setShowAlert] = useState(false)

    useEffect(()=>{
        let alertCondition = localStorage.getItem('showMessage')
        if(alertCondition === 'true'){
            setShowAlert(true)
        }
    },[])

    const handleMsgClose = () => {
        setShowAlert(false)
        localStorage.setItem('showMessage',false)
    }

    return (
        <Container maxWidth="sm">
            <Stack 
                marginTop={14}
                marginBottom={3} 
                spacing={2}
                direction="column"
                alignItems="center"
            >
                <Avatar
                    sx={{
                        bgcolor: blue[500],
                    }}
                >
                    <PersonIcon/>
                </Avatar>
                <Typography variant="h5" component="h1">Sign In</Typography>
            </Stack>
            {!isValidLogin && <Alert severity="error" onClose={() => {setIsValidLogin(true)}}>Invalid Login Credentials</Alert>}
            {showAlert && <Alert severity="info" onClose={handleMsgClose}>Login into your Account</Alert>}
            <Snackbar open={open} onClose={handleClose} anchorOrigin={{vertical:'top',horizontal:'right'}} autoHideDuration={2500}>
                <Alert onClose={handleClose} severity="success">
                    Logged in Successfully
                </Alert>
            </Snackbar>
            <Stack
                component="form"
                mt={3.5}
                mb={2}
                display="block"
                spacing={2.5}
                noValidate
                autoComplete="off"
                onSubmit={(event)=>handleSubmit(event)}
            >
                <TextField variant="outlined" label="Email Address" value={email} onChange={(event)=>setEmail(event.target.value)} error={!isEmailValid} helperText={!isEmailValid && errorEmail} required fullWidth/>
                <TextField type="password" variant="outlined" label="Password" value={password} onChange={(event)=>setPassword(event.target.value)} error={!isPasswordValid} helperText={!isPasswordValid && errorPassword} required fullWidth/>
                <FormControlLabel
                    control={<Checkbox />} label="Remember me" 
                />
                <LoadingButton type="submit" variant="contained" color="primary" size="large" loading={loading} endIcon={<LoginIcon fontSize="inherit"/>} loadingPosition="end" fullWidth>Sign In</LoadingButton>
            </Stack>
            <Stack flexDirection="row" justifyContent="space-between" mt={2}>
                <Link>
                    <Button sx={{textDecoration:"underline"}} disableRipple disableElevation>Forgot Password?</Button>
                </Link>
                <Link to="/signup">
                    <Button sx={{textDecoration:"underline"}} disableRipple disableElevation>
                        Don't have an account? Sign Up
                    </Button>
                </Link>
            </Stack>
        </Container>
  )
}

export default SignInForm