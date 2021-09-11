import {useContext, useState} from "react";
import {MPContext} from "./App";
import {Link as RouterLink} from "react-router-dom";
import {
    Box,
    List,
    ListItem,
    Link,
    ListItemIcon,
    ListItemText,
    IconButton,
    Drawer,
    AppBar,
    Toolbar, Typography, Hidden, InputBase, Divider
} from "@material-ui/core";
import {alpha, styled} from "@material-ui/core/styles"
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PhotoAlbumOutlinedIcon from '@material-ui/icons/PhotoAlbumOutlined';
import PhotoCameraOutlinedIcon from '@material-ui/icons/PhotoCameraOutlined';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';
import SearchIcon from "@material-ui/icons/Search";
import MPIcon from "./common/MPIcon";


type TopBarProps = {
    showSearch: boolean
}

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey["50"],
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}))

const SearchInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}))

const TopBar: React.FC<TopBarProps> = ({showSearch}) => {
    const context = useContext(MPContext)

    const BurgerMenu: React.FC = () => {
        type Anchor = 'top' | 'left' | 'bottom' | 'right'

        const [state, setState] = useState({top: false, left: false, bottom: false, right: false})

        const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
                return
            }
            setState({...state, [anchor]: open})
        }

        const menuList = (anchor: Anchor) => (
            <Box sx={{width: 250}}
                 role="presentation"
                 onClick={toggleDrawer('right', false)}
                 onKeyDown={toggleDrawer('right', false)}>
                <List>
                    <ListItem button key='HomePage' component={RouterLink} to="/">
                        <ListItemIcon><HomeOutlinedIcon/></ListItemIcon>
                        <ListItemText primary='HomePage'/>
                    </ListItem>
                    <ListItem button key='Photos' component={RouterLink} to="/photo">
                        <ListItemIcon><PhotoOutlinedIcon/></ListItemIcon>
                        <ListItemText primary='Photos'/>
                    </ListItem>
                    <ListItem button key='Albums' component={RouterLink} to="/album">
                        <ListItemIcon><PhotoAlbumOutlinedIcon/></ListItemIcon>
                        <ListItemText primary='Albums'/>
                    </ListItem>
                    <ListItem button key='Cameras' component={RouterLink} to="/camera">
                        <ListItemIcon><PhotoCameraOutlinedIcon/></ListItemIcon>
                        <ListItemText primary='Cameras'/>
                    </ListItem>
                    <ListItem button key='GuestPage' component={RouterLink} to="/guest">
                        <ListItemIcon>{context.isGuest ? <PersonIcon/> : <PersonAddIcon/>}</ListItemIcon>
                        <ListItemText primary={context.isGuest ? 'Guest' : 'Add GuestPage'}/> :
                    </ListItem>
                </List>
            </Box>
        )

        return (
            <>
                <IconButton edge="start" aria-label="menu" onClick={toggleDrawer("right", true)} size={"small"}>
                    <MenuIcon fontSize="large"/>
                </IconButton>

                <Drawer anchor='right' open={state['right']} onClose={toggleDrawer('right', false)}>
                    {menuList('right')}
                </Drawer>
            </>
        )

    }

    return (
        <AppBar sx={{marginLeft: 0, marginRight: 0}} position="sticky" color="inherit" elevation={0}>
            <Toolbar style={{paddingLeft: 0, paddingRight: 0}}
                     variant={context.uxConfig.denseTopBar ? "dense" : "regular"}>
                <Box sx={{marginLeft: 0}}>
                    <IconButton aria-label="home" color="inherit" component={RouterLink} to="/">
                        <MPIcon key="topLogo" mpcolor="white"
                                fontSize={context.uxConfig.denseTopBar ? "medium" : "large"}/>
                    </IconButton>
                </Box>
                <Link component={RouterLink} to={"/"} color={"inherit"} style={{textDecoration: 'none'}}>
                    <Typography variant={"body2"} component={'span'}>
                        <Box letterSpacing={2}>
                            MELLOWTECH<br/>
                            PHOTOS
                        </Box>
                    </Typography>
                </Link>
                {showSearch &&
                <Hidden xsDown>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <SearchInputBase placeholder="Search…" inputProps={{'aria-label': 'search'}}/>
                    </Search>
                </Hidden>
                }
                <Box sx={{flexGrow: 1}}/>
                <Hidden xsDown>
                    <IconButton aria-label="home" color="inherit" component={RouterLink} to="/">
                        <HomeOutlinedIcon fontSize={context.uxConfig.denseTopBar ? "medium" : "large"}/>
                    </IconButton>
                    <IconButton aria-label="photos" color="inherit" component={RouterLink} to="/photo">
                        <PhotoOutlinedIcon fontSize={context.uxConfig.denseTopBar ? "medium" : "large"}/>
                    </IconButton>
                    <IconButton aria-label="albums" color="inherit" component={RouterLink} to="/album">
                        <PhotoAlbumOutlinedIcon fontSize={context.uxConfig.denseTopBar ? "medium" : "large"}/>
                    </IconButton>
                    <IconButton aria-label="cameras" color="inherit" component={RouterLink} to="/camera">
                        <PhotoCameraOutlinedIcon fontSize={context.uxConfig.denseTopBar ? "medium" : "large"}/>
                    </IconButton>
                    <IconButton aria-label="guest" color="inherit" component={RouterLink} to="/guest">
                        {context.isGuest ?
                            <PersonIcon fontSize={context.uxConfig.denseTopBar ? "medium" : "large"}/> :
                            <PersonAddIcon fontSize={context.uxConfig.denseTopBar ? "medium" : "large"}/>
                        }
                    </IconButton>
                </Hidden>
                <Hidden smUp>
                    <BurgerMenu/>
                </Hidden>
            </Toolbar>
            <Divider/>
        </AppBar>
    )
}

export default TopBar