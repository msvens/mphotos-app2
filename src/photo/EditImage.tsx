import {EditPhotoParams, Photo, PhotoType} from "../api/types";
import {Box, Dialog} from "@mui/material";
import PhotosApi from "../api/photoapi";
import {styled} from "@mui/system";
import 'react-image-crop/dist/ReactCrop.css'
import {useEffect, useRef, useState} from "react";
import ReactCrop, {centerCrop, Crop, makeAspectCrop, PixelCrop} from "react-image-crop";
import CropPhotoControls, {EditAction} from "./CropPhotoControls";
import useRotateImage from "../hooks/useRotatedImage";


type EditImageProps = {
    photo: Photo,
    openDialog: boolean,
    onClose: () => void,
    onPrev: () => void,
    onNext: () => void,
    photoBackground: string,
    largeDisplay: boolean
}

const landscape = 1200 / 628
const square = 1
const portrait = 1080 / 1350

const StyledImg = styled('img')({
    objectFit: 'contain',
    maxWidth: '100%',
    maxHeight: '96vh',
    width: 'auto',
    height: '96vh',
})

/*
type ImgDim = {
    width: number,
    height: number
}*/


function getAspect(p: Photo): number {
    return p.width / p.height
}

const EditImage: React.FC<EditImageProps> = ({
                                                 photo, openDialog, largeDisplay,
                                                 onClose, onPrev, onNext, photoBackground
                                             }) => {

    const imgRef = useRef<HTMLImageElement>(null)
    const [aspect, setAspect] = useState<number|undefined>(getAspect(photo))
    const [rotate, setRotate] = useState<number>(0)
    const [preview, setPreview] = useState<boolean>(false)
    const {src: imgSrc} = useRotateImage(PhotosApi.getImageUrl(photo, PhotoType.Original, false, false), rotate) ?? {};
    const[crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

    useEffect(() => {
        setAspect(getAspect(photo))
        setRotate(0)
    }, [photo])

    useEffect(() => {
        if(imgRef.current && aspect)
            setCrop(centerAndAspectCrop(aspect, imgRef.current.width, imgRef.current.height))
    }, [aspect])

    function centerAndAspectCrop(aspect: number, width: number, height: number): Crop {
        return centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                aspect,
                width,
                height
            ),
            width,
            height
        )
    }

    function getPhotoParams(): EditPhotoParams {
        const ret: EditPhotoParams = {}
        if(crop && imgRef.current) {
            ret.x = Math.floor(crop.x/100 * imgRef.current.naturalWidth)
            ret.y = Math.floor(crop.y/100 * imgRef.current.naturalHeight)
            ret.width = Math.floor(crop.width/100 * imgRef.current.naturalWidth)
            ret.height = Math.floor(crop.height/100 * imgRef.current.naturalHeight)
        }
        ret.rotation = rotate
        return ret
    }

    const onCropChange = (crop: PixelCrop, percentCrop: Crop) => setCrop(percentCrop)
    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        alert("onImageLoad")
        const {width, height} = e.currentTarget;
        setCrop(centerAndAspectCrop(getAspect(photo), width, height))
        //alert("load: "+width+" "+height)
        //setDim({width: width, height: height})
        //imgWidth = width
        //imgHeight = height
    }

    /*
    const handleUpdatePhotoCrop = () => {
        alert("clicked ok")
        onClose()
    }*/

    const handleEditAction = (a: EditAction) => {
        switch (a) {
            case EditAction.CropPortrait:
                setAspect(portrait)
                break;
            case EditAction.CropLandscape:
                setAspect(landscape);
                break;
            case EditAction.CropSquare:
                /*if (dim)
                    setCrop(centerAndAspectCrop(square, dim.width, dim.height))*/
                setAspect(square)
                break;
            case EditAction.CropFree:
                setAspect(undefined)
                break;
            case EditAction.RotateRight:
                setRotate(r => {return (r + 90) % 360})
                break;
            case EditAction.RotateRight5:
                setRotate(r => {return (r + 5) % 360})
                break;
            case EditAction.Restore:
                setRotate(0)
                setAspect(getAspect(photo))
                break;
            case EditAction.Save:
                setPreview(prev => !prev)
                break;
            default:
                alert(EditAction[a] + " not implemented")

        }
    }


    return (
        <Dialog PaperProps={{style: {backgroundColor: photoBackground}}}
                fullScreen open={openDialog} onClose={onClose}>

            <Box style={{backgroundColor: photoBackground}} sx={{
                display: 'flex',
                margin: 'auto',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
            }}>

                {preview
                    ? <StyledImg src={PhotosApi.getEditPreviewURL(photo, getPhotoParams())}/>
                    : <ReactCrop crop={crop} onChange={onCropChange} aspect={aspect} onComplete={(c) => setCompletedCrop(c)}>
                    <StyledImg ref={imgRef} src={imgSrc} onLoad={onImageLoad}/>
                    </ReactCrop>
                }
                <CropPhotoControls photoBackground={photoBackground}
                                   verticalEditButtons
                                   onBackward={onPrev}
                                   onForward={onNext}
                                   onClose={onClose}
                                   isLargeDisplay={largeDisplay}
                                   onEdit={handleEditAction}
                                   hasBorders={false}/>
            </Box>
        </Dialog>
    );
};

export default EditImage;