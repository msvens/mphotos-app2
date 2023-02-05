import {colorScheme} from "../api/apiutil";
import {IconButton, Tooltip, alpha, Box, useTheme} from "@mui/material";
import ArrowBackIosSharpIcon from "@mui/icons-material/ArrowBackIosSharp";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import Forward5Icon from '@mui/icons-material/Forward5';
//import FlipIcon from '@mui/icons-material/Flip';
import SaveIcon from '@mui/icons-material/Save';
import CropPortraitIcon from '@mui/icons-material/CropPortrait';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import CropLandscapeIcon from '@mui/icons-material/CropLandscape';
import CropFreeIcon from '@mui/icons-material/CropFree';
import CloseIcon from '@mui/icons-material/Close';
import RestorePageIcon from '@mui/icons-material/RestorePage';


import React from "react";

type CropPhotoControlsProps = {
    photoBackground: string
    isLargeDisplay: boolean
    hasBorders: boolean
    navigationButtons?: boolean
    onBackward: () => void
    onForward: () => void
    onClose: () => void
    verticalEditButtons?: boolean,
    onEdit: (a: EditAction) => void
}

type EditButtonProps = {
    tooltip: string,
    onClick: () => void,
}

export enum EditAction {
    CropPortrait,
    CropSquare,
    CropLandscape,
    CropFree,
    RotateLeft,
    Save,
    Restore,
    RotateRight,
    RotateRight5
}


const CropPhotoControls: React.FC<CropPhotoControlsProps> = (props) => {

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

    const onSave = () => {
        props.onEdit(EditAction.Save)
    }
    const onLandscape = () => {
        props.onEdit(EditAction.CropLandscape)
    }
    const onSquare = () => {
        props.onEdit(EditAction.CropSquare)
    }
    const onPortrait = () => {
        props.onEdit(EditAction.CropPortrait)
    }
    const onRotateRight = () => {
        props.onEdit(EditAction.RotateRight)
    }
    const onRotateRight5 = () => {
        props.onEdit(EditAction.RotateRight5)
    }


    return (
        <>
            {props.navigationButtons &&
               <>
                    <IconButton aria-label="previous" onClick={props.onBackward}
                                sx={backButtonStyle}>
                        <ArrowBackIosSharpIcon fontSize={iconS()}/>
                    </IconButton>
                    <IconButton aria-label="next" color="primary" onClick={props.onForward}
                                sx={forwardButtonStyle} edge={"end"}>
                        <ArrowForwardIosSharpIcon fontSize={iconS()}/>
                    </IconButton>
              </>
            }
            <IconButton aria-label="Exit edit mode" color="primary" onClick={props.onClose}
                        sx={fullScreenButtonStyle}>
                <CloseIcon fontSize={iconS()}/>
            </IconButton>
            <Box sx={editButtonsStyle}>
                <EditButton tooltip="Portrait Crop" onClick={onPortrait}>
                    <CropPortraitIcon fontSize={iconS()}/>
                </EditButton>
                <EditButton tooltip="Ladscape Crop" onClick={onLandscape}>
                    <CropLandscapeIcon fontSize={iconS()}/>
                </EditButton>
                <EditButton tooltip="Square Crop" onClick={onSquare}>
                    <CropSquareIcon fontSize={iconS()}/>
                </EditButton>
                <EditButton tooltip="Free Crop" onClick={() => props.onEdit(EditAction.CropFree)}>
                    <CropFreeIcon fontSize={iconS()}/>
                </EditButton>
                <EditButton tooltip="Rotate Image 90°" onClick={onRotateRight}>
                    <Rotate90DegreesCwIcon fontSize={iconS()}/>
                </EditButton>
                <EditButton tooltip="Rotate Image 5°" onClick={onRotateRight5}>
                    <Forward5Icon fontSize={iconS()}/>
                </EditButton>
                <EditButton tooltip="Restore Original" onClick={() => props.onEdit(EditAction.Restore)}>
                    <RestorePageIcon fontSize={iconS()}/>
                </EditButton>
                <EditButton tooltip="Save Image" onClick={onSave}>
                    <SaveIcon fontSize={iconS()}/>
                </EditButton>
            </Box>

        </>
    )
}

export default CropPhotoControls