import {Album} from "../api/types";
import PhotosApi from "../api/photoapi";
import {Box, Button, IconButton, ImageList, ImageListItem, ImageListItemBar} from "@mui/material";
import EditAlbum from "./EditAlbum";
import {Link as RouterLink} from "react-router-dom";
import AddAlbum from "./AddAlbum";
import MPDialog from "../common/MpDialog";
import InfoIcon from '@mui/icons-material/Info'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import {useContext, useEffect, useState} from "react";
import {MPContext} from "../App";
import {styled} from "@mui/system";

type AlbumGridProps = {
    columns: number,
    spacing: "thin" | "normal" | "thick",
}

type AlbumInfoProps = {
    album: Album,
    index: number
}

const IconButtonColor = {
    color: 'rgba(255, 255, 255, 0.8)',
} as const

const RootDiv = styled('div')({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    paddingLeft: 0,
    margin: 'auto',
})

const Thumb = styled('img')({
    width: '100%',
    height: '100%'
})

const AlbumGrid: React.FC<AlbumGridProps> = ({columns, spacing}) => {
    //const classes = useStyles();

    const [idx, setIdx] = useState<number>(0);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showAdd, setShowAdd] = useState(false)
    const [showDelete, setShowDelete] = useState(false)

    const context = useContext(MPContext)

    useEffect(() => {
        PhotosApi.getAlbums().then(res => setAlbums(res)).catch(e => alert(e.toString()))
    }, []);

    const getSpacing = (): number => {
        if (spacing === "normal") {
            return 15;
        } else if (spacing === "thin") {
            return 10;
        } else {
            return 20;
        }
    }

    const getAlbumCover = (album: Album): string => {
        if (album.coverPic === "") {
            return "/album.png"
        } else {
            return PhotosApi.getThumbUrlId(album.coverPic)
        }
    }

    const handleCloseUpdate = (a?: Album) => {
        if(a) {
            const newAlbums = albums.map((aa) => {
                if(aa.id === a.id)
                    return a
                else
                    return aa
            })
            setAlbums(newAlbums)
        }
        setShowUpdate(false)
    }

    const handleCloseAdd = (a?: Album) => {
        if(a) {
            const newAlbums = [...albums]
            newAlbums.push(a)
            setAlbums(newAlbums)
            setIdx(0)
        }
        setShowAdd(false)
    }

    const deleteAlbum = () => {
        const del = async () => {
            try {
                const id = albums[idx].id
                await PhotosApi.deleteAlbum(id)
                const newAlbums = albums.filter((a) => a.id !== id)
                setIdx(0)
                setAlbums(newAlbums)
            } catch (e) {
                alert(e)
            }
        }
        del()
    }

    const AlbumInfo: React.FC<AlbumInfoProps> = ({album, index}) => {
        if (context.isUser) {
            return (
                <ImageListItemBar sx={{width: '100%'}} title={album.name}
                                 actionIcon={
                                     <>
                                         <IconButton aria-label={`edit ${album.name}`} style={IconButtonColor}
                                                     onClick={() => {
                                                         setIdx(index);
                                                         setShowUpdate(true)
                                                     }}>
                                             <EditIcon/>
                                         </IconButton>
                                         <IconButton aria-label={`delete ${album.name}`} style={IconButtonColor}
                                                     onClick={() => {
                                                         setIdx(index);
                                                         setShowDelete(true)
                                                     }}>
                                             <DeleteForeverIcon/>
                                         </IconButton>
                                     </>
                                 }
                />
            );
        } else if (album.description === "") {
            return (<ImageListItemBar sx={{width: '100%'}} title={album.name}/>);
        } else {
            return (
                <ImageListItemBar sx={{width: '100%'}} title={album.name}
                                 actionIcon={
                                     <IconButton aria-label={`info about ${album.name}`} style={IconButtonColor}>
                                         <InfoIcon/>
                                     </IconButton>
                                 }
                />
            );
        }
    }

    return (
        <RootDiv>
            {context.isUser &&
            <>
                <MPDialog open={showDelete} onClose={() => setShowDelete(false)}
                          onOk={deleteAlbum} title={"Delete Album"}
                          text="Deleting an album will not remove the associated images"/>

                <AddAlbum open={showAdd} onClose={handleCloseAdd}/>
            </>
            }
            {context.isUser &&
            <Box sx={{width: 1020, maxWidth: 1020, margin: 'auto', paddingBottom: 1}}
                 display="flex" flexGrow={1}>
                <Button variant="outlined"
                        startIcon={<AddPhotoAlternateOutlinedIcon/>}
                        onClick={() => {
                            setShowAdd(true)
                        }}>
                    Add New Album
                </Button>
            </Box>
            }
            <ImageList sx={{width: 1020, maxWidth: 1020, margin: 'auto'}}
                       cols={columns} rowHeight='auto' gap={getSpacing()}>
                {albums.map((album, index) => (
                    <ImageListItem sx={{width: '100%',height: 'auto'}} cols={1} key={album.name}>
                        <RouterLink to={`/album/${album.id}`}>
                            <Thumb alt={album.name} src={getAlbumCover(album)}/>
                        </RouterLink>
                        <AlbumInfo album={album} index={index}/>
                    </ImageListItem>
                ))}
            </ImageList>
            {albums.length > 0 &&
            <EditAlbum open={showUpdate} album={albums[idx]} onClose={handleCloseUpdate}/>
            }
        </RootDiv>
    );
};

export default AlbumGrid