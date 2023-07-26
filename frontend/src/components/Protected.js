import { Navigate } from "react-router-dom"

function Protected({children}){

    if(!localStorage.getItem('current_user')){
        return <Navigate to="/signin" replace />
    }

    return children
}

export default Protected