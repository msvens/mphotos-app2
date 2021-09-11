import {useParams} from "react-router-dom";
import {MPContext} from "../App";
import {useContext} from "react";
import PhotosApi from "../api/photoapi";
import {Box, Button, List, ListItem, ListItemText, Typography} from "@material-ui/core";
import Profile from "./Profile";
import Drive from "./Drive";
import EditUXConfig from "./EditUXConfig";
import {Link as RouterLink} from "react-router-dom";
import Login from "./Login";

const PROFILE = 'profile';
const DRIVE = 'drive';
const LOGOUT = 'logout';
const UXCONFIG = 'uxconfig'

//type MenuItems = 'Profile' | 'Drive' | 'Logout' | 'UX';

const MenuItems = new Map<string, string>([
        [PROFILE, "Profile"],
        [DRIVE, "Drive"],
        [UXCONFIG, "UX Config"],
        [LOGOUT, "Logout"],
    ]
)

const UserPage: React.FC = () => {
    const {setting} = useParams<any>()
    const context = useContext(MPContext)


    const handleLogout = async (e: React.MouseEvent) => {
        PhotosApi.logout().then(res => {
            context.checkUser()
        }).catch(e => alert("check user: " + e));
    };


    return (
        <Box sx={{
            display: 'flex',
            maxWidth: 1000,
            margin: 'auto',
            paddingTop: 4,
            paddingBottom: 2
        }}>
            <Box sx={{minWidth: 140, flexShrink: 0,}} component={"span"} borderRight={1}>
                <List>
                    {Array.from(MenuItems.entries()).map((entry, idx) => (
                        <ListItem key={entry[0]} button component={RouterLink} to={`/user/${entry[0]}`}>
                            <ListItemText primary={entry[1]} primaryTypographyProps={{variant: "h6"}}/>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box sx={{flexGrow: 1, paddingLeft: 3, paddingRight: 3}}>
                {!context.isUser && <Login/>}
                {context.isUser && setting === undefined && <Profile/>}
                {context.isUser && setting === PROFILE && <Profile/>}
                {context.isUser && setting === DRIVE && <Drive/>}
                {context.isUser && setting === UXCONFIG && <EditUXConfig/>}
                {context.isUser && setting === LOGOUT &&
                <Box>
                    <Typography paragraph>
                        By Logging out you will no longer be able to upload pictures, etc.
                    </Typography>
                    <Button variant="outlined" onClick={handleLogout}>Logout Now</Button>
                </Box>
                }
            </Box>
        </Box>
    );
}

export default UserPage