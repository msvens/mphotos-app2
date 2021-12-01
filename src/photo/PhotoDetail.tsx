import {Guest, GuestReaction, Photo, PhotoComment} from "../api/types";
import {useContext, useEffect, useState} from "react";
import {MPContext} from "../App";
import PhotosApi from "../api/photoapi";
import {toCameraId} from "../api/apiutil";
import {Box, Button, Grid, IconButton, InputBase, Paper, Typography} from "@mui/material";
import Link from "@mui/material/Link";
import {Link as RouterLink} from "react-router-dom";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddGuest from "../guest/AddGuest";

type PhotoDetailProps = {
    photo: Photo,
    showDate?: boolean,
    showKeywords?: boolean,
    showDescription?: boolean,
    showLens?: boolean,
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const PhotoDetail: React.FC<PhotoDetailProps> = (props: PhotoDetailProps) => {

    const context = useContext(MPContext)

    //const classes = useStyles(colorScheme(context.uxConfig.photoDetailBackgroundColor))

    const [guests, setGuests] = useState<GuestReaction[]>([])
    const [comments, setComments] = useState<PhotoComment[]> ([])
    const [showAddGuest, setShowAddGuest] = useState(false)
    const [newComment, setNewComment] = useState<string>('')
    const [likesPhoto, setLikesPhoto] = useState<boolean> (false)


    useEffect( () => {
        if(context.isGuest) {
            PhotosApi.getGuestLike(props.photo.id).then(res => setLikesPhoto(res)).catch(e => alert("error: "+e.toString()))
        } else {
            setLikesPhoto(false)
        }
    }, [props.photo, context.isGuest])

    useEffect(() => {
        PhotosApi.getPhotoLikes(props.photo.id).then(res => setGuests(res)).catch(e => alert("error: "+e.toString()))

    }, [props.photo, likesPhoto])

    useEffect(() => {
        PhotosApi.getPhotoComments(props.photo.id).then(res => setComments(res)).catch(e => alert("error: "+e.toString()))

    }, [props.photo])

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
    }

    const handleAddComment = () => {
        if(!context.isGuest) {
            setShowAddGuest(true)
        } else {
            PhotosApi.commentPhoto(props.photo.id, newComment)
                .then(_res => {
                    setNewComment('')
                    PhotosApi.getPhotoComments(props.photo.id)
                        .then(res => setComments(res))
                }).catch(err => alert(err))
        }
    }

    const handleClickLike = () => {
        if(!context.isGuest) {
            setShowAddGuest(true)
        } else {
            PhotosApi.likePhoto(props.photo.id).then(_res => setLikesPhoto(true)).catch(e => alert(e))

        }
    }

    const handleClickUnlike = () => {
        PhotosApi.unlikePhoto(props.photo.id).then(_res => setLikesPhoto(false)).catch(e => alert(e))
    }

    const getDate = () => {
        const date = new Date(props.photo.originalDate)
        return "Taken on " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + ". "
    }

    const getLikes = () => {
        if (guests.length === 0) {
            return "Be the first to like this picture"
        }
        if (likesPhoto) {
            switch (guests.length) {
                case 1:
                    return "Liked by you"
                case 2:
                    return "liked by you and " + (guests.length - 1) + " other"
                default:
                    return "liked by you and " + (guests.length - 1) + " others"
            }
        } else {
            switch (guests.length) {
                case 1:
                    return "Liked by "+guests[0].name
                case 2:
                    return "liked by "+guests[0].name+" and " + (guests.length - 1) + " other"
                default:
                    return "liked by "+guests[0].name+" and " + (guests.length - 1) + " others"
            }
        }
    }

    const getTitle = () => {
        return props.photo.title === "" ? "Untitled" : props.photo.title;
    }

    const getCamera = () => {
        return props.photo.cameraModel
    }

    /*
    const getQuery = () => {
        return toQueryString(createPhotoSearchParams(props.photo.cameraModel))
    }
    */

    const getLens = () => {
        return props.photo.lensModel
    }

    const getFocal = () => {
        if (props.photo.focalLength35 !== "")
            return props.photo.focalLength + " (" + props.photo.focalLength35 + "). ";
        else
            return props.photo.focalLength + ". ";
    }

    const getCameraSetting = () => {
        return "f" + props.photo.fNumber + ". iso" + props.photo.iso + ". " + props.photo.exposure + " secs."
    }

    const getLikesButton = () => {
        if (likesPhoto) {
            return <IconButton sx={{color: '#b5043c'}} edge={"start"} aria-label={"like"} size={"small"}
                               onClick={handleClickUnlike}>
                <FavoriteIcon fontSize={"large"}/>
            </IconButton>
        } else {
            return <IconButton edge={"start"} aria-label={"like"} color="inherit" size={"small"}
                               onClick={handleClickLike}>
                <FavoriteBorderIcon fontSize={"large"}/>
            </IconButton>
        }
    }

    interface CommentBoxProps {
        comment: PhotoComment,
        index: number
    }

    const CommentBox: React.FC<CommentBoxProps> = ({comment, index}) => {
        const d = PhotosApi.toDate(comment.time)
        const dStr = d.toDateString()
        return (
            <Box sx={{marginTop: 2, marginRight: 2}}>
                <Typography variant="body2" color={"secondary"}>
                    {comment.name}, {dStr}
                </Typography>
                <Typography variant="body2">
                    {comment.body}
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', marginTop: 1, marginLeft: 2, marginRight: 2}}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    {getLikesButton()}
                    <Typography variant="body2" display={"inline"}>
                        {getLikes()}
                    </Typography>
                    <Paper sx={{marginTop: 3, padding: '2px 4px', display: 'flex', alignItems: 'center'}}
                           component="form" variant="outlined">
                        <InputBase
                            sx={{marginLeft: 1, flex: 1, fontSize: '0.9rem'}}
                            placeholder="Add comment..."
                            multiline={true}
                            fullWidth={true}
                            onChange={handleCommentChange}
                            value={newComment}
                            inputProps={{ 'aria-label': 'Add comment...' }}
                        />
                        <Button color="inherit" onClick={handleAddComment}>Post</Button>
                    </Paper>
                    {comments.map((comment,index) => (
                        <CommentBox comment={comment} index={index}/>
                    ))}

                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">
                        <Box fontWeight={"fontWeightBold"}>
                            {getTitle()}
                        </Box>
                    </Typography>
                    <Typography variant="body2">
                        {getDate()}
                        <br/>
                        Camera: <Link component={RouterLink} to={`/camera/${toCameraId(props.photo.cameraModel)}`}>
                        {getCamera()}
                    </Link><br/>
                        {/*Camera: <Link component={RouterLink} to={`/photo/${props.photo.driveId}?${getQuery()}`}>
                            {getCamera()}
                        </Link><br/>*/}
                        Focal length: {getFocal()}<br/>
                        Settings: {getCameraSetting()}<br/>
                        Lens: {getLens()}
                    </Typography>
                </Grid>
            </Grid>
            <AddGuest open={showAddGuest} update={false}
                            onClose={() => setShowAddGuest(false)} />
        </Box>
    )
}

PhotoDetail.defaultProps = {
    showDate: true,
    showKeywords: false,
    showDescription: false,
    showLens: true
} as Partial<PhotoDetailProps>

export default PhotoDetail