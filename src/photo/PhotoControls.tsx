import {colorScheme} from "../api/apiutil";
import {IconButton, Tooltip, alpha, Box, useTheme} from "@material-ui/core";
import ArrowBackIosSharpIcon from "@material-ui/icons/ArrowBackIosSharp";
import ArrowForwardIosSharpIcon from "@material-ui/icons/ArrowForwardIosSharp";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PhotoAlbumIcon from "@material-ui/icons/PhotoAlbum";
import FaceIcon from "@material-ui/icons/Face";
import React from "react";

type PhotoControlsProps = {
    photoBackground: string
    isLargeDisplay: boolean
    showEditControls: boolean
    inFullscreen: boolean
    hasBorders: boolean
    onBackward: () => void
    onForward: () => void
    onFullScreen: () => void
    isPrivate?: boolean,
    verticalEditButtons?: boolean,
    onPrivate?: () => void
    onDelete?: () => void
    onEdit?: () => void
    onProfilePic?: () => void
    isAlbum?: boolean
}

type EditButtonProps = {
    tooltip: string,
    onClick: () => void,
}


const PhotoControls: React.FC<PhotoControlsProps> = (props) => {

    const cs = colorScheme(props.photoBackground)
    const theme = useTheme()

    const editButtonStyle = {
        color: cs.color,
        backgroundColor: alpha(cs.backgroundColor, props.hasBorders ? 0.0 : 0.5).toString(),
        marginRight: 1,
        '&:hover':
            {
                backgroundColor: alpha(cs.backgroundColor, 0.9).toString(),
            }
    } as const

    const editButtonsStyle = {
        ...editButtonStyle,
        display: 'flex',
        flexDirection: props.verticalEditButtons ? 'column' : 'row',
        position: 'absolute',
        top: theme.spacing(0),
        left: theme.spacing(0),
    } as const

    const fullScreenButtonStyle = {
        ...editButtonStyle,
        position: 'absolute',
        top: theme.spacing(0),
        right: theme.spacing(-1),
    } as const

    const backButtonStyle = {
        ...editButtonStyle,
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        left: theme.spacing(0),
    } as const

    const forwardButtonStyle = {
        ...editButtonStyle,
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        right: theme.spacing(-1)
    } as const

    const iconS = () => {
        return props.isLargeDisplay ? 'large' : 'small'
    }

    const EditButton: React.FC<EditButtonProps> = ({tooltip, onClick, children}) => {
        return (
            <Tooltip title={tooltip}>
                <IconButton aria-label={tooltip} onClick={onClick}
                            sx={editButtonStyle}>
                    {children}
                </IconButton>
            </Tooltip>

        )
    }

    const wrap = (f?: () => void):()=>void => {
        if(f)
            return f
        else
            return () => {alert("undefiend action")}
    }

    return (
        <>
            <IconButton aria-label="previous" onClick={props.onBackward}
                        sx={backButtonStyle}>
                <ArrowBackIosSharpIcon fontSize={iconS()}/>
            </IconButton>
            <IconButton aria-label="next" color="primary" onClick={props.onForward}
                        sx={forwardButtonStyle} edge={"end"}>
                <ArrowForwardIosSharpIcon fontSize={iconS()}/>
            </IconButton>
            {props.inFullscreen
                ? <IconButton aria-label="exit fullscreen" color="primary" onClick={props.onFullScreen}
                              sx={fullScreenButtonStyle}>
                    <FullscreenExitIcon fontSize={iconS()}/>
                </IconButton>
                : <IconButton aria-label="enter fullscreen" color="primary" onClick={props.onFullScreen}
                              sx={fullScreenButtonStyle}>
                    <FullscreenIcon fontSize={iconS()}/>
                </IconButton>
            }
            {props.showEditControls &&
            <Box sx={editButtonsStyle}>
                {props.isAlbum
                    ? <EditButton tooltip="Set Album Cover" onClick={wrap(props.onProfilePic)}>
                        <PhotoAlbumIcon fontSize={iconS()}/>
                    </EditButton>
                    : <EditButton tooltip="Set Profile Picture" onClick={wrap(props.onProfilePic)}>
                        <FaceIcon fontSize={iconS()}/>
                    </EditButton>
                }
                {props.isPrivate
                    ? <EditButton tooltip="Set Public Photo" onClick={wrap(props.onPrivate)}>
                        <LockIcon fontSize={iconS()}/>
                    </EditButton>
                    : <EditButton tooltip="Set Private Photo" onClick={wrap(props.onPrivate)}>
                        <LockOpenIcon fontSize={iconS()}/>
                    </EditButton>
                }
                <EditButton tooltip="Edit Photo Description" onClick={wrap(props.onEdit)}>
                    <EditIcon fontSize={iconS()}/>
                </EditButton>
                <EditButton tooltip="Delete Photo" onClick={wrap(props.onDelete)}>
                    <DeleteForeverIcon fontSize={iconS()}/>
                </EditButton>
            </Box>
            }
        </>
    )
}

export default PhotoControls