import {Link as RouterLink} from "react-router-dom";
import Link from "@mui/material/Link";
import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import {useContext} from "react";
import {MPContext} from "./App";

const linkText = {
    textTransform: 'uppercase',
    margin: 0,
    marginRight: 1,
    marginLeft: 1,
    fontSize: '80%'
} as const

function toLink(to: string, name: string) {
    return (
        <Link sx={linkText}
              color={"inherit"} style={{ textDecoration: 'none' }} component={RouterLink} to={to}>
            <Typography variant="caption" gutterBottom={false}>
                <Box sx={linkText}>{name}</Box>
            </Typography>
        </Link>
    )
}
const BottomBar: React.FC = () => {
    const context = useContext(MPContext)
    return (
        <AppBar sx={{marginLeft: 0, marginRight: 0, top: 'auto', bottom: 0}}
                position="relative" color={'transparent'} elevation={0}>
            <Toolbar style={{paddingLeft:0, paddingRight:0}}
                     variant={context.uxConfig.denseBottomBar ? "dense" : "regular"}>
                <Box sx={{flexGrow: 1}}/>
                {toLink("/about", "ABOUT")}
                {toLink("/resume", "RESUME")}
                {toLink("/", "MELLOWTECH.ORG")}
                {toLink("/user", "ADMIN")}
                <Box sx={{flexGrow: 1}}/>
            </Toolbar>
        </AppBar>
    )
}

export default BottomBar