import { Alert, Avatar, Button, Container, Grid, Snackbar, Stack, TextField, Typography } from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import { blue } from "@mui/material/colors"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import LoadingButton from '@mui/lab/LoadingButton'
import LoginIcon from '@mui/icons-material/Login'
import axios from "axios"

function SignUpForm(){

    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const [errorName,setErrorName] = useState('')
    const [errorEmail,setErrorEmail] = useState('')
    const [errorPassword,setErrorPassword] = useState('')

    const [isNameValid,setIsNameValid] = useState(true)
    const [isEmailValid,setIsEmailValid] = useState(true)
    const [isPasswordValid,setIsPasswordValid] = useState(true)

    const [open,setOpen] = useState(false)
    const [loading,setLoading] = useState(false)

    const navigate = useNavigate()

    const handleError =(error) => {
        const valid = error.valid
        setLoading(false)

        if(valid && (valid.hasOwnProperty('name') || valid.hasOwnProperty('email') || valid.hasOwnProperty('password'))){
            if(valid.hasOwnProperty('name')){
                setErrorName(valid.name[0])
                setIsNameValid(false)
            }
            else{
                setIsNameValid(true) 
            }
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
    }

    const handleSignUp = (res) => {
        if(res==="User created successfully"){
            setIsNameValid(true)
            setIsEmailValid(true) 
            setIsPasswordValid(true)
            setLoading(false)
            setOpen(true)
        }
    }
    
    const handleClose = () =>{
        localStorage.setItem('showMessage',true)
        navigate('/signin')
        setOpen(false)
    }

    const handleSubmit = (event) =>{
        event.preventDefault()
        setLoading(true)
        let name = firstName + ' ' + lastName
        let credentials = {name,email,password}

        axios({
            method:'post',
            url:`${process.env.REACT_APP_API_URL}/register`,
            data:JSON.stringify(credentials),
            headers:{
                "Content-Type":"application/json",
            }
        })
        .then(res => handleSignUp(res.data.message))
        .catch(err => handleError({"valid":err.response.data.errors}))
    }

    return (
        <Container maxWidth="sm">
            <Stack direction="column" spacing={2} alignItems="center" mt={14} mb={3}>
                <Avatar sx={{bgcolor:blue[500]}}>
                    <PersonIcon />
                </Avatar>
                <Typography variant="h5" component="h1">Sign Up</Typography>
            </Stack>
            <Snackbar open={open} onClose={handleClose} anchorOrigin={{vertical:'top',horizontal:'right'}} autoHideDuration={2500}>
                <Alert onClose={handleClose} severity="success">
                    Signed Up Successfully
                </Alert>
            </Snackbar>
            <Grid container spacing={2.5} component="form" noValidate autoComplete="off" onSubmit={(event)=>handleSubmit(event)}>
                <Grid item xs={12} sm={6}>
                    <TextField label="First Name" value={firstName} onChange={(event)=>setFirstName(event.target.value)} error={!isNameValid} helperText={!isNameValid && errorName} required fullWidth/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Last Name" value={lastName} onChange={(event)=>setLastName(event.target.value)} fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Email Address" value={email} onChange={(event)=>setEmail(event.target.value)} error={!isEmailValid} helperText={!isEmailValid && errorEmail} required fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField type="password" label="Password" value={password} onChange={(event)=>setPassword(event.target.value)} error={!isPasswordValid} helperText={!isPasswordValid && errorPassword} required fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <LoadingButton variant="contained" type="submit" size="large" loading={loading} endIcon={<LoginIcon fontSize="inherit"/>} loadingPosition="end" fullWidth>Sign Up</LoadingButton>
                </Grid>
            </Grid>
            <Stack flexDirection="row" justifyContent="space-between" mt={2}>
                <Link to="/signin">
                    <Button ml="auto" sx={{
                        textDecoration:"underline"
                    }} 
                    disableRipple disableElevation>
                        Already have an account? Sign in
                    </Button>
                </Link>
            </Stack>
        </Container>
    )
}

export default SignUpForm