import {useHistory, useLocation, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {MPContext} from "../App";
import {colorScheme, parseSearchParams} from "../api/apiutil";
import {PhotoDeck} from "./PhotoDeck";
import {Album, ColorScheme, Photo, PhotoList, PhotoType} from "../api/types";
import {Grid, useMediaQuery, useTheme} from "@mui/material";
import PhotosApi from "../api/photoapi";
import PhotoControls from "./PhotoControls";
import PhotoDetail from "./PhotoDetail";
import FullscreenPhoto from "./FullscreenPhoto";
import EditPhoto from "./EditPhoto";
import MPDialog from "../common/MpDialog";
import PhotoFilter from "./PhotoFilter";
import {styled} from "@mui/system";

type TouchState = {
    xStart: number,
    xPos: number,
    yStart: number,
    yPos: number
}

type PhotoParams = {
    photoId: any,
    albumId: any
}

const RootDiv = styled('div')(({theme}) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    margin: 'auto',
    paddingBottom: theme.spacing(2),
}))

const SmallImg = styled('img')({
    maxWidth: '100%',
    maxHeight: '100%',
    alignSelf: 'flex-start'
})

const NormalImg = styled('img')({
    objectFit: 'contain',
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
})

const LeftRightImg = styled('img')(({theme}) => ({
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(7),
    objectFit: 'contain',
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
}))

const FullImg = styled('img')(({theme}) => ({
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(7),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    objectFit: 'contain',
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
}))

const ImgGridStyle = {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80vh',
    maxheight: '85vh'
} as const

const SmallImgGridStyle = {
    position: 'relative',
    margin: 'auto',
    display: 'flex',
} as const

const detailGrid = {
    paddingTop: 1,
    margin: 'auto',
    maxWidth: 1024,
} as const

const detailGridBorders = {
    ...detailGrid,
    paddingLeft: 1,
    paddingRight: 1,
}


const PhotoPage: React.FC = () => {

    const {photoId, albumId} = useParams<PhotoParams>()
    const location = useLocation()
    const history = useHistory()
    const context = useContext(MPContext)
    const cs: ColorScheme = colorScheme(context.uxConfig.photoBackgroundColor)
    const theme = useTheme()
    const [photos, setPhotos] = useState<PhotoDeck>(new PhotoDeck())
    const [album, setAlbum] = useState<Album>()
    const [showDelete, setShowDelete] = useState(false)
    const [showUpdate, setShowUpdate] = useState(false)
    const [showFullscreen, setShowFullscreen] = useState(false)
    const touch: TouchState = {xStart: -1, xPos: -1, yStart: -1, yPos: -1}

    const isPortrait = useMediaQuery('(orientation: portrait)')
    const isLargeDisplay = useMediaQuery(theme.breakpoints.up('sm'))

    useEffect(() => {

        const updatePhotos = (pl: PhotoList) => {
            if (pl.photos) {
                let newIdx = 0
                if (photoId) {
                    for (let i = 0; i < pl.length; i++) {
                        if (pl.photos[i].driveId === photoId) {
                            newIdx = i
                        }
                    }
                }
                setPhotos(new PhotoDeck(pl.photos, newIdx))
            } else {
                setPhotos(new PhotoDeck())
            }

        }

        const fetchData = async () => {
            if (location.search) {
                await PhotosApi.searchPhotos(parseSearchParams(location.search)).then(res => {
                    updatePhotos(res)
                });
            } else if (albumId) {
                await PhotosApi.getAlbum(albumId).then(res => {
                    setAlbum(res.info)
                    updatePhotos(res.photos)
                });
            } else {
                await PhotosApi.getPhotos(1000).then(res => {
                    updatePhotos(res)
                });
            }

        };
        fetchData();
    }, [photoId, location.search, albumId])

    const hasBorders = () => {
        return isLargeDisplay && (context.uxConfig.photoBorders !== "none")
    }

    const getImageComponent = () => {
        if (isLargeDisplay) {
            if (context.uxConfig.photoBorders === "none") {
                return (
                    <>
                        <NormalImg alt={photos.get().title}
                                   src={PhotosApi.getImageUrl(photos.get(), PhotoType.Dynamic, isPortrait, isLargeDisplay)}/>
                    </>
                )
            } else if (context.uxConfig.photoBorders === "left-right")
                return (
                    <>
                        <LeftRightImg alt={photos.get().title}
                                      src={PhotosApi.getImageUrl(photos.get(), PhotoType.Dynamic, isPortrait, isLargeDisplay)}/>
                    </>
                )
            else
                return (
                    <>
                        <FullImg alt={photos.get().title}
                                 src={PhotosApi.getImageUrl(photos.get(), PhotoType.Dynamic, isPortrait, isLargeDisplay)}/>
                    </>
                )
        } else {
            return (
                <>
                    <SmallImg alt={photos.get().title}
                              src={PhotosApi.getImageUrl(photos.get(), PhotoType.Dynamic, isPortrait, isLargeDisplay)}/>
                </>
            )
        }
    }

    const deletePhoto = () => {
        PhotosApi.deletePhoto(photos.driveId(), true)
            .then(_p => {
                setPhotos(photos.delete())
            })
            .catch(e => alert(e.toString()))
    }

    const handleBackward = () => {
        setPhotos(photos.previous())
        //history.push('/photo/' + photo.driveId())
        window.history.pushState({}, '', '/photo/' + photos.driveId())
    }

    const handleCloseUpdate = (p?: Photo) => {
        if (p) {
            setPhotos(photos.update(p))
        }
        setShowUpdate(false)
    }

    const handleForward = () => {
        setPhotos(photos.next())
        //history.push('/photo/' + photo.next().driveId())
        window.history.pushState({}, '', '/photo/' + photos.driveId())
    }

    const handlePrivate = () => {
        PhotosApi.togglePrivate(photos.driveId())
            .then(p => {
                setPhotos(photos.update(p))
            })
            .catch(e => alert(e.toString()));
    }

    const onStartTouch = (event: React.TouchEvent<HTMLDivElement>) => {
        if (showFullscreen || (event.touches && event.touches.length > 1)) return

        touch.xStart = event.touches[0].clientX
        touch.yStart = event.touches[0].clientY
        touch.xPos = touch.xStart
        touch.yPos = touch.yStart

    }

    const onMoveTouch = (event: React.TouchEvent<HTMLDivElement>) => {
        if (showFullscreen || (event.touches && event.touches.length > 1)) return
        touch.xPos = event.touches[0].clientX;
        touch.yPos = event.touches[0].clientY;

    };

    const onEndTouch = (event: React.TouchEvent<HTMLDivElement>) => {
        if (showFullscreen || (event.touches && event.touches.length > 1)) return

        const deltaX = touch.xStart - touch.xPos
        const deltaY = touch.yStart - touch.yPos
        touch.xStart = touch.yStart = touch.xPos = touch.yPos = -1

        if (Math.abs(deltaX) > 30 && Math.abs(deltaY) < 40)
            deltaX < 0 ? handleBackward() : handleForward();
    };


    return (
        <RootDiv>
            {photos.hasPhotos() &&
            <>
                <Grid container sx={{alignItems: "center", justifyContent: "space-around"}}>
                    {location.search &&
                    <Grid item xs={12}>
                        <PhotoFilter cs={cs} filter={location.search}
                                     onClear={() => history.push('/photo/' + photos.driveId())}/>
                    </Grid>
                    }
                    <Grid item xs={12} style={{backgroundColor: context.uxConfig.photoBackgroundColor}}
                          sx={isLargeDisplay ? ImgGridStyle : SmallImgGridStyle}
                          onTouchEnd={onEndTouch}
                          onTouchStart={onStartTouch}
                          onTouchMove={onMoveTouch}>
                        <PhotoControls photoBackground={context.uxConfig.photoBackgroundColor}
                                       onBackward={handleBackward}
                                       onForward={handleForward}
                                       onFullScreen={() => setShowFullscreen(true)}
                                       onPrivate={handlePrivate}
                                       onDelete={() => setShowDelete(true)}
                                       onEdit={() => setShowUpdate(true)}
                                       onProfilePic={() => alert("edit")}
                                       showEditControls={context.isUser}
                                       isAlbum={!!album}
                                       isPrivate={photos.get().private}
                                       isLargeDisplay={isLargeDisplay}
                                       inFullscreen={false}
                                       hasBorders={hasBorders()}
                                       verticalEditButtons={hasBorders()}

                        />
                        {getImageComponent()}
                        {/* <img className={getImageClass()} alt={photo.get().title}
                             src={PhotosApi.getImageUrl(photo.get(), PhotoType.Dynamic, isPortrait, isLargeDisplay)}/>*/}

                    </Grid>
                    <Grid item xs={12} sx={hasBorders() ? detailGridBorders : detailGrid}>
                        <PhotoDetail photo={photos.get()}/>
                    </Grid>
                </Grid>
                <FullscreenPhoto photo={photos.get()} openDialog={showFullscreen}
                                 onClose={() => setShowFullscreen(false)} onNext={handleForward}
                                 onPrev={handleBackward} photoBackground={context.uxConfig.photoBackgroundColor}
                                 largeDisplay={isLargeDisplay}/>
                <EditPhoto open={showUpdate} photo={photos.get()} onClose={handleCloseUpdate}/>
                <MPDialog open={showDelete}
                          onClose={() => setShowDelete(false)}
                          onOk={deletePhoto}
                          title={"Delete Photo?"}
                          text="By removing the photo all associated image data will be deleted"/>
            </>
            }
        </RootDiv>
    )
}

export default PhotoPage