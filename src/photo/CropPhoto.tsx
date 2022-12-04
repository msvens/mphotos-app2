import {useState} from "react"
import ReactCrop, {centerCrop, Crop, makeAspectCrop, PercentCrop, PixelCrop} from "react-image-crop"

import 'react-image-crop/dist/ReactCrop.css'
import PhotosApi from "../api/photoapi"
import {Photo, PhotoType} from "../api/types"
import MPDialog from "../common/MpDialog"
import CropPortraitIcon from '@mui/icons-material/CropPortrait';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import CropLandscapeIcon from '@mui/icons-material/CropLandscape';
import {alpha, useTheme} from "@mui/material"
import {colorScheme} from "../api/apiutil"


type CropPhotoProps = {
    onUpdate: (p?: Photo) => void
    photo: Photo
    open: boolean
    photoBackground: string
    hasBorders: boolean
}

const landscape = 1200 / 628
const square = 1
const portrait = 1080 / 1350

const CropPhoto: React.VFC<CropPhotoProps> = ({open, photo, onUpdate, photoBackground, hasBorders}) => {

    const [crop, setCrop] = useState<Crop>({
        unit: '%', // Can be 'px' or '%'
        x: 25,
        y: 25,
        width: 50,
        height: 50
    })
    const theme = useTheme()

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

        const crop = centerCrop(
                makeAspectCrop(
                        {
                            // You don't need to pass a complete crop into
                            // makeAspectCrop or centerCrop.
                            unit: '%',
                            width: 90,
                        },
                        landscape,
                        width,
                        height
                        ),
                width,
                height
                )

        setCrop(crop)
    }


    const cs = colorScheme(photoBackground)

    const editButtonStyle = {
        color: cs.color,
        backgroundColor: alpha(cs.backgroundColor, hasBorders ? 0.0 : 0.5).toString(),
        marginRight: 1,
        '&:hover':
            {
                backgroundColor: alpha(cs.backgroundColor, 0.9).toString(),
            }
    } as const

    const editButtonsStyle = {
        ...editButtonStyle,
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        top: theme.spacing(0),
        left: theme.spacing(0),
    } as const

    const handleUpdatePhotoCrop = () => {
        alert("clicked ok")
        onUpdate(undefined)
    }

    const handleOnClose = () => {
        alert("clicked close")
        onUpdate(undefined)
    }


    return (
        <MPDialog open={open} onClose={handleOnClose} onOk={handleUpdatePhotoCrop} title={"Crop and Rotate Photo"}
                  closeOnOk={false}>

            <ReactCrop crop={crop} onChange={c => setCrop(c)} aspect={portrait}>
                <img src={PhotosApi.getImageUrl(photo, PhotoType.Original, false, true)}
                onLoad={onImageLoad}/>
            </ReactCrop>
        </MPDialog>
    )
}

export default CropPhoto