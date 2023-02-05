import {useState} from "react"
import ReactCrop, {centerCrop, Crop, makeAspectCrop} from "react-image-crop"

import 'react-image-crop/dist/ReactCrop.css'
import PhotosApi from "../api/photoapi"
import {Photo, PhotoType} from "../api/types"
import MPDialog from "../common/MpDialog"
import {styled} from "@mui/system";

const NormalImg = styled('img')({
  objectFit: 'contain',
  maxWidth: '100%',
  maxHeight: '100vh',
  width: 'auto',
  height: '100vh',
})

type CropPhotoProps = {
    onUpdate: (p?: Photo) => void
    photo: Photo
    open: boolean
    photoBackground: string
    hasBorders: boolean
}

const portrait = 1080 / 1350

const CropPhoto: React.VFC<CropPhotoProps> = ({open, photo, onUpdate}) => {

    const [crop, setCrop] = useState<Crop>({
        unit: '%', // Can be 'px' or '%'
        x: 25,
        y: 25,
        width: 50,
        height: 50
    })
    //const theme = useTheme()

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
                        portrait,
                        width,
                        height
                        ),
                width,
                height
                )
        //alert("setting crop")
        setCrop(crop)
    }


    //const cs = colorScheme(photoBackground)

    /*
    const editButtonStyle = {
        color: cs.color,
        backgroundColor: alpha(cs.backgroundColor, hasBorders ? 0.0 : 0.5).toString(),
        marginRight: 1,
        '&:hover':
            {
                backgroundColor: alpha(cs.backgroundColor, 0.9).toString(),
            }
    } as const*/

    /*
    const editButtonsStyle = {
        ...editButtonStyle,
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        top: theme.spacing(0),
        left: theme.spacing(0),
    } as const
    */

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

            {/*<RootDiv>
                <Box sx={{display: "flex", flexGrow: 1, flexDirection: "column"}}>
                    <NormalImg src={PhotosApi.getImageUrl(photo, PhotoType.Resize, false, true)}
                               onLoad={onImageLoad}/>
                </Box>
            </RootDiv>*/}

          <ReactCrop crop={crop} onChange={c => setCrop(c)} aspect={portrait}>
            <NormalImg src={PhotosApi.getImageUrl(photo, PhotoType.Resize, false, true)}
              onLoad={onImageLoad}/>
          </ReactCrop>

        </MPDialog>
    )
}

export default CropPhoto