import {ColorScheme} from "../api/types";
import {parseSearchParams} from "../api/apiutil";
import {Button, Grid} from "@material-ui/core";
import {styled} from "@material-ui/system";

type PhotoFilterProps = {
    filter: string
    onClear: () => void
    cs: ColorScheme
}

type RootDivColor = {
    fgc: string,
    bgc: string
}
const RootDiv = styled('div', {
    shouldForwardProp: (prop) => prop !== 'fgc' && prop !== 'bgc'
})<RootDivColor>(({theme, fgc, bgc}) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    margin: 'auto',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    backgroundColor: bgc,
    color: fgc
}))

const PhotoFilter: React.FC<PhotoFilterProps> = (props) => {
    const f = parseSearchParams(props.filter)
    return (
        <RootDiv fgc={props.cs.color} bgc={props.cs.backgroundColor}>
            <Grid container spacing={6} sx={{alignItems: 'center', justifyContent: 'center'}}>
                <Grid item>
                    {f.cameraModel &&
                    "Camera Model: " + f.cameraModel
                    }
                </Grid>
                <Grid item>
                    <Button variant="outlined" size="small" color="inherit" onClick={props.onClear}>
                        Clear Filter
                    </Button>
                </Grid>
            </Grid>
        </RootDiv>
    )
}

export default PhotoFilter

