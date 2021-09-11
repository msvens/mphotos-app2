import {Photo, PhotoType} from "../api/types";
import {Box, Dialog} from "@material-ui/core";
import PhotoControls from "./PhotoControls";
import PhotosApi from "../api/photoapi";
import {styled} from "@material-ui/system";

type FullscreenPhotoProps = {
    photo: Photo,
    openDialog: boolean,
    onClose: () => void,
    onPrev: () => void,
    onNext: () => void,
    photoBackground: string,
    largeDisplay: boolean
}

interface TouchState {
    xStart: number,
    xPos: number,
    yStart: number,
    yPos: number
}

const StyeledImg = styled('img')({
    objectFit: 'contain',
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
})

const FullscreenPhoto: React.FC<FullscreenPhotoProps> = ({photo, openDialog, largeDisplay,
                                                             onClose, onPrev, onNext, photoBackground}) => {


    //const [touch, setTouch] = useState<TouchState>({xStart: -1, xPos: -1, yStart: -1, yPos: -1})
    const touch: TouchState = {xStart: -1, xPos: -1, yStart: -1, yPos: -1}


    const onStartTouch = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!openDialog || (event.touches && event.touches.length > 1)) return

        touch.xStart = event.touches[0].clientX
        touch.yStart = event.touches[0].clientY
        touch.xPos = touch.xStart
        touch.yPos = touch.yStart

    }

    const onMoveTouch = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!openDialog || (event.touches && event.touches.length > 1)) return
        touch.xPos = event.touches[0].clientX;
        touch.yPos = event.touches[0].clientY;

    };

    const onEndTouch = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!openDialog || (event.touches && event.touches.length > 1)) return

        const deltaX = touch.xStart - touch.xPos
        const deltaY = touch.yStart - touch.yPos
        touch.xStart = touch.yStart = touch.xPos = touch.yPos = -1

        if(Math.abs(deltaX) > 30 && Math.abs(deltaY) < 40)
            deltaX < 0 ? onPrev() : onNext();
    };



    return (
        <Dialog PaperProps={{ style: {backgroundColor: photoBackground} }}
                fullScreen open={openDialog} onClose={onClose} onTouchStart={onStartTouch} onTouchMove={onMoveTouch}>
            <Box style={{backgroundColor: photoBackground}} sx={{display: 'flex',
                margin: 'auto',
                alignItems: 'center',
                justifyContent: 'center',
                maxHeight: '100%',
                height: '100%'}} onTouchEnd={onEndTouch}>
                <StyeledImg alt={photo.title} src={PhotosApi.getImageUrl(photo, PhotoType.Original, false, false)}/>
                <PhotoControls photoBackground={photoBackground}
                               onBackward={onPrev}
                               onForward={onNext}
                               onFullScreen={onClose}
                               showEditControls={false}
                               isLargeDisplay={largeDisplay}
                               inFullscreen={true} hasBorders={false}/>
            </Box>
        </Dialog>
    );
};

export default FullscreenPhoto;