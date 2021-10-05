import {Album, Photo} from "../api/types";
import {useEffect, useState} from "react";
import PhotosApi from "../api/photoapi";
import MPDialog from "../common/MpDialog";
import {FormControl, Input, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";

type EditPhotoProps = {
    open: boolean
    photo: Photo
    onClose: (p?: Photo) => void
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

const EditPhoto: React.FC<EditPhotoProps> = ({open, photo, onClose}) => {

    const [albums,setAlbums] = useState<Album[]> ([])
    const [albumNames, setAlbumNames] = useState<string[]> ([])
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [keywords, setKeywords] = useState<string>('')

    useEffect(() => {
        PhotosApi.getAlbums()
            .then(res => setAlbums(res))
    },[])

    useEffect(() => {
        //setP(photo)
        setTitle(photo.title)
        setDescription(photo.description)
        setKeywords(photo.keywords)
        setAlbumNames([])

    }, [photo])

    useEffect(() => {
        const fetchAlbums = async () => {
            const res = await PhotosApi.getPhotoAlbums(photo.id)
            const names: string[] = []
            for(let i = 0; i < res.length; i++) {
                names.push(res[i].name)
            }
            setAlbumNames(names)
        }
        fetchAlbums()
    }, [photo])

    const getAlbumIds: () => string[] = () => {
        const ids: string[] = []
        for(let i = 0; i < albumNames.length; i++) {
            for(let j = 0; j < albums.length; j++) {
                if(albumNames[i] === albums[j].name) {
                    ids.push(albums[j].id)
                    break
                }
            }
        }
        return ids
    }

    const handleOnClose = () => {
        onClose(undefined)
    }

    const handleUpdatePhoto = () => {
        PhotosApi.updatePhoto(photo.id, title, description, keywords, getAlbumIds())
            .then(res => {
                onClose(res)
            })
            .catch(e => alert(e.toString()))
    }

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    }

    const handleKeywordsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeywords(event.target.value);
    }

    const handleAlbumChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setAlbumNames( typeof value === 'string' ? value.split(',') : value);
    }

    const dialogText = "Update title, description and keywords. Observe that keywords should be comma separated"

    return (

        <MPDialog open={open} onClose={handleOnClose} onOk={handleUpdatePhoto} title={"Edit Photo"} text={dialogText}
                  closeOnOk={false}>
            <TextField margin="dense" id="title" label="Title" value={title}
                       onChange={handleTitleChange} fullWidth/>
            <TextField margin="dense" id="keywords" label="Keywords" value={keywords}
                       onChange={handleKeywordsChange} fullWidth/>
            <FormControl sx={{ minWidth: 300, maxWidth: 300,}}>
                <InputLabel id="albums-label">Albums</InputLabel>
                <Select
                    labelId="albums-label"
                    id="select-albums"
                    multiple
                    value={albumNames}
                    onChange={handleAlbumChange}
                    input={<Input />}
                    MenuProps={MenuProps}
                >
                    {albums.map((album) => (
                        <MenuItem key={album.name} value={album.name}>
                            {album.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField margin="dense" id="description" label="Description" value={description}
                       onChange={handleDescriptionChange} fullWidth multiline rows={2} />
        </MPDialog>
    )
}

export default EditPhoto