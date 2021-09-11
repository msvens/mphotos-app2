import {Album} from "../api/types";
import {useState} from "react";
import PhotosApi from "../api/photoapi";
import MPDialog from "../common/MpDialog";
import {TextField} from "@material-ui/core";

type AddAlbumProps = {
    open: boolean,
    onClose: (a?: Album) => void,
}

const AddAlbum: React.FC<AddAlbumProps>  = ({open, onClose}) => {

    const [name, setName] = useState<string>("")
    const [description, setDescription] = useState<string>("")

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    }

    const handleOnClose = () => {
        onClose(undefined)
    }

    const handleOk = () => {
        const update = async () => {
            try {
                const res = await PhotosApi.addAlbum(name, description, "")
                onClose(res)
            } catch (e) {
                alert(e)
            }

        }
        update()
    }

    return (
        <MPDialog open={open} onClose={handleOnClose} onOk={handleOk} title={"Add Album"}
                  text={"Create album. You can later add photo to it"} closeOnOk={false}>
            <TextField margin="dense" id="name" label="Name" value={name}
                       onChange={handleNameChange} fullWidth/>
            <TextField margin="dense" id="description" label="Description" value={description}
                       onChange={handleDescriptionChange} fullWidth multiline rows={2} />
        </MPDialog>
    )
}

export default AddAlbum