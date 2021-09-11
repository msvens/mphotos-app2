import {useHistory, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {MPContext} from "../App";
import {Camera} from "../api/types";
import PhotosApi from "../api/photoapi";
import {Grid, IconButton, List, ListItem, ListItemText, ListSubheader, TextField} from "@material-ui/core";
import CameraDetail from "./CameraDetail";
import EditIcon from '@material-ui/icons/Edit';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import MPDialog from "../common/MpDialog";
import UpdateCamera from "./UpdateCamera";
import {styled} from "@material-ui/system";

const RootDiv = styled('div')(({theme}) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    paddingLeft: 0,
    margin: 'auto',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    maxWidth: 1024
}))

const CameraPage: React.FC = () => {
    const {cameraId}= useParams<any>()
    const context = useContext(MPContext)
    const history = useHistory()
    const [cameras, setCameras] = useState<Camera[]>([])
    const [camera, setCamera] = useState<Camera>()
    const [showImageDialog, setShowImageDialog] = useState(false)
    const [showUpdateDialog, setShowUpdateDialog] = useState(false)
    const [url, setUrl] = useState("")


    useEffect(() => {
        PhotosApi.getCameras().then(c => {
            setCameras(c)
            if(cameraId) {
                let didSet = false
                for(var cc of c) {
                    if(cc.id === cameraId) {
                        setCamera(cc)
                        didSet = true
                        break
                    }
                }
                if(!didSet)
                    setCamera(c[0])
            } else {
                setCamera(c[0])
            }
        }).catch(err => alert(err))
    },[cameraId])


    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    }

    const onUpdateCamera = (u?: Camera) => {
        if(u) {
            PhotosApi.getCameras().then(c => {
                setCameras(c)
                for (var cc of c) {
                    if (cc.id === u.id) {
                        setCamera(cc)
                    }
                }
            })
        }
        setShowUpdateDialog(false)
    }

    const onUpdateUrl = () => {
        const update = async () => {
            try {
                if(camera) {
                    await PhotosApi.updateCameraImage(camera.id, url)
                    const newCams = await PhotosApi.getCameras()
                    for(var cc of newCams) {
                        if(cc.id === camera.id)
                            setCamera(cc)
                    }
                    setCameras(newCams)

                }
            } catch (e) {
                alert(e)
            }
        }
        update()
    }

    return (
        <RootDiv>
            <Grid container spacing={4} sx={{justifyContent: "space-between", alignContent: "space-between"}}>
                <Grid item>
                    <List subheader={<ListSubheader>Cameras</ListSubheader>}>
                        {cameras.length > 0 && cameras.map((c,idx) => (
                            <ListItem key={c.id} dense button
                                      onClick={() => {
                                          setCamera(c)
                                          history.push('/camera/'+c.id)
                                      }} selected={c.id === (camera && camera.id)}>
                                <ListItemText>{c.model}</ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item>
                    {camera &&
                    <CameraDetail camera={camera} onUpdate={onUpdateCamera}>
                        {context.isUser &&
                        <div>
                            <IconButton aria-label="Edit Camera Image" color="inherit" onClick={() => setShowImageDialog(true)}>
                                <ImageOutlinedIcon fontSize={"small"}/>
                            </IconButton>
                            <IconButton aria-label="Edit Camera Spec" color="inherit" onClick={() => setShowUpdateDialog(true)}>
                                <EditIcon fontSize={"small"}/>
                            </IconButton>
                        </div>
                        }
                    </CameraDetail>

                    }
                </Grid>
            </Grid>
            <MPDialog open={showImageDialog} closeOnOk={false} onClose={() => setShowImageDialog(false)} onOk={() => onUpdateUrl()} title={"Image URL"}
                      text={"Choose Image for this Camera"}>
                <TextField margin="dense" id="name" label="Url" value={url}
                           onChange={handleUrlChange} fullWidth/>
            </MPDialog>
            {context.isUser && camera &&
            <UpdateCamera open={showUpdateDialog} onClose={onUpdateCamera}
                                camera={camera}/>
            }
        </RootDiv>
    )
}

export default CameraPage