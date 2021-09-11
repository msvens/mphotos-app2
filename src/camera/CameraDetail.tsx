import {Camera, CameraImageSize} from "../api/types";
import {createPhotoSearchParams, getCameraSettingDisplayName, toQueryString} from "../api/apiutil";
import {TableCell, TableRow, Typography, Link, Table, TableBody, Box} from "@material-ui/core";
import {Link as RouterLink} from "react-router-dom";
import PhotosApi from "../api/photoapi";
import {styled} from "@material-ui/system";

type CameraDetailProps = {
    camera: Camera
    onUpdate: (c: Camera) => void
}

const CameraImage = styled('img') ({
    maxWidth: '100%',
    maxHeight: '100%',
    alignSelf: 'flex-start'
})

const CameraDetail: React.FC<CameraDetailProps> = ({camera, onUpdate, children}) => {
    //const classes = useStyles()

    function row(key: string) {
        const disp = getCameraSettingDisplayName(key, camera)
        return (
            <TableRow>
                <TableCell component="th" scope="row">{disp.displayName}</TableCell>
                <TableCell>{disp.displayValue}</TableCell>
            </TableRow>

        )
    }

    const getQuery = () => {
        return toQueryString(createPhotoSearchParams(camera.model))
    }

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around',
            overflow: 'wrap', paddingLeft: 0, margin: 'auto', maxWidth: 600}}>
            <Box sx={{display: 'flex', flexBasis: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>{camera.model} (<Link color={"inherit"} component={RouterLink} to={`/photo?${getQuery()}`}>Photos</Link>)
                    </strong>
                </Typography>
            </Box>
            <Box sx={{paddingTop: 4, paddingBottom: 4, margin: 'auto'}}>
                <CameraImage alt={camera.model} src={PhotosApi.getCameraImageUrl(camera, CameraImageSize.Medium)}/>
            </Box>
            <Box sx={{display: 'flex', flexBasis: '100%', justifyContent: 'center', alignItems: 'center'}}>
                {children}
            </Box>

            <Table sx={{minWidth: 512, maxWidth: 600,}} aria-label="Camera Specs" size={"small"}>
                <TableBody>
                    {Object.getOwnPropertyNames(camera).filter(v => v !== "id" && v !== "image")
                        .map((n, i) => {return row(n)})
                    }
                    {/*{Object.getOwnPropertyNames(camera).map((v,i) => {
                        if(v !== "id" && v !== "image")
                            return row(v)
                    })}*/}
                </TableBody>
            </Table>

        </Box>

    )
}

export default CameraDetail