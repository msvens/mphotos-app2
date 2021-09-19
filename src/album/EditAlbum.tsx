import {Album} from "../api/types";
import {useEffect, useState} from "react";
import PhotosApi from "../api/photoapi";
import MPDialog from "../common/MpDialog";
import {TextField} from "@mui/material";

type EditAlbumProps = {
    open: boolean,
    album: Album,
    onClose: (a?: Album) => void,
}

const EditAlbum: React.FC<EditAlbumProps>  = ({open, album, onClose}) => {

    const [name, setName] = useState<string>(album.name);
    const [description, setDescription] = useState<string>(album.description)

    useEffect(() => {
        setName(album.name);
        setDescription(album.description);
    }, [album]);


    const handleOk = () => {
        const updateAlbum = async () => {
            const id = album.id
            const coverPic = album.coverPic
            try {
                const a = await PhotosApi.updateAlbum({id, name, description, coverPic})
                onClose(a)
            } catch(e) {
                alert(e)
            }
        }
        updateAlbum()
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    }

    return (
        <MPDialog open={open} onClose={() => onClose(undefined)} onOk={handleOk} closeOnOk={false} title="Edit Album"
                  text={"Change album name or description"}>
            <TextField margin="dense" id="name" label="Name" value={name}
                       onChange={handleNameChange} fullWidth/>
            <TextField margin="dense" id="description" label="Description" value={description}
                       onChange={handleDescriptionChange} fullWidth multiline rows={2}/>
        </MPDialog>
    )
};

export default EditAlbum
