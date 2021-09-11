import {Grid, Typography} from "@material-ui/core";
import AlbumGrid from "./AlbumGrid";
import {styled} from "@material-ui/system";

const RootDiv = styled('div')(({theme}) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    paddingLeft: 0,
    margin: 'auto',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2)
}))

const InfoDiv = styled('div')(({theme}) => ({
    flexGrow: 1,
    flexWrap: 'wrap',
    margin: 'auto',
    width: 1020,
    maxWidth: 1020,
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4)
}))


const AlbumPage: React.FC = () => {
    return (
        <RootDiv>
            <InfoDiv>
                <Grid container spacing={3} sx={{justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Grid item>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Photo Albums</strong>
                        </Typography>
                        <Typography variant="body2" gutterBottom>Things that fit</Typography>
                    </Grid>
                </Grid>
            </InfoDiv>
            <AlbumGrid columns={3} spacing="normal"/>
        </RootDiv>
    );

}

export default AlbumPage