import {Avatar, Box, Button, Divider, Grid, Typography, useMediaQuery, useTheme} from "@material-ui/core";
import {useContext} from "react";
import {MPContext} from "../App";
import {styled} from "@material-ui/system";
import PhotosApi from "../api/photoapi";
import {Link as RouterLink} from "react-router-dom";

const RootDiv = styled('div')(({theme}) => ({
    flexGrow: 1,
    flexWrap: 'wrap',
    margin: 'auto',
    paddingBottom: theme.spacing(4),
}))

const Bio: React.FC = () => {

    const theme = useTheme()
    const isLargeDisplay = useMediaQuery(theme.breakpoints.up('sm'))
    const context = useContext(MPContext)

    const getImgClass = () => {
        if(isLargeDisplay) {
            return {
                width: 128,
                height: 128,
                maxWidth: 128,
                maxHeight: 128,
            }
        } else {
            return {
                width: 68,
                height: 68,
                maxWidth: 68,
                maxHeight: 68,
            }
        }
    }

    return (
        <Box sx={{flexGrow: 1, flexWrap: 'wrap', margin: 'auto', paddingBottom: 4}}>
            <Grid sx={{paddingBottom: 4, alignItems: 'center', justifyContent: 'center'}} container spacing={6}>
                <Grid item>
                    <Avatar alt={context.user.name} src={PhotosApi.getProfilePicUrl(context.user)} sx={getImgClass()}/>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1" gutterBottom>
                        <strong>{context.user.name}</strong>
                    </Typography>
                    <Typography variant="body2" gutterBottom>{context.user.bio}</Typography>
                </Grid>
                {context.isUser &&
                <Grid item>
                    <Button sx={{textTransform: 'none', borderRadius: 1}} variant="outlined" size="small" color="inherit" component={RouterLink} to={"/user"}>
                        Admin
                    </Button>
                </Grid>
                }
            </Grid>
            <Divider/>
        </Box>
    );
};

export default Bio