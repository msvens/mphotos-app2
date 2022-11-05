import {useState} from "react"
import ReactCrop, {Crop} from "react-image-crop"

import 'react-image-crop/dist/ReactCrop.css'
import PhotosApi from "../api/photoapi"
import {Photo, PhotoType} from "../api/types"
import MPDialog from "../common/MpDialog"


type CropPhotoProps = {
    onUpdate: (p?: Photo) => void
    photo: Photo
    open: boolean
}

const landscape = 1200/628
const square = 1
const portrait = 1080/1350

const CropPhoto: React.VFC<CropPhotoProps> = ({open, photo, onUpdate}) => {
    const [crop, setCrop] = useState<Crop>()

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
                <img src={PhotosApi.getImageUrl(photo, PhotoType.Original, false, true)}/>
            </ReactCrop>
        </MPDialog>
    )
}

export default CropPhoto