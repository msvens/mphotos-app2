import {useContext, useState} from "react";
import {MPContext} from "../App";
import PhotosApi from "../api/photoapi";
import {Alert, Button, Snackbar, TextField, Typography} from "@material-ui/core";

const Login: React.FC = () => {

    const [password, setPassword] = useState("")
    const [alert, setAlert] = useState(false)
    const context = useContext(MPContext)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const handleLogin = () => {
        PhotosApi.login(password).then(res => context.checkUser()).catch(err => setAlert(true))
    }

    return (
        <>
            <Snackbar anchorOrigin={{vertical:'top', horizontal:'center'}} open={alert} autoHideDuration={6000} onClose={() => setAlert(false)}>
                <Alert onClose={() => setAlert(false)} severity="error">
                    Incorrect Password
                </Alert>
            </Snackbar>
            <Typography paragraph>Login to edit settings</Typography>
            <TextField sx={{marginBottom: 4}}
                       id="loginField"
                       label="password"
                       fullWidth
                       size="medium"
                       margin="normal"
                       name="password"
                       value={password}
                       variant="outlined"
                       onChange={handleChange}/>
            <Button onClick={handleLogin} variant="contained" color="primary" type="submit">Submit</Button>
        </>
    )
}

export default Login