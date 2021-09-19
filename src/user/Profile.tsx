import {Button, TextField} from "@mui/material";
import PhotosApi from "../api/photoapi";
import {useEffect, useState} from "react";

const Profile: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [pic, setPic] = useState<string>('');

    useEffect(() => {
        PhotosApi.getUser()
            .then(u => {
                setName(u.name);
                setBio(u.bio);
                setPic(u.pic);
            })
            .catch(e => alert(e.toString()))
    },[]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const handleBioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBio(event.target.value);
    };
    const handlePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPic(event.target.value);
    };

    const handleSubmit = () =>  {
        PhotosApi.updateUser(name, bio, pic)
            .then(u => {
                setName(u.name);
                setBio(u.bio);
                setPic(u.pic);
            })
            .catch(err => alert(err.toString()))
    };

    return (

        <>
            <TextField id="nameField" label="Name" size="medium" margin="normal" variant="outlined"
                       value={name} onChange={handleNameChange} fullWidth/>
            <TextField id="picField" label="Profile Picture" variant="outlined" margin="normal"
                       value={pic} onChange={handlePicChange} fullWidth/>
            <TextField sx={{marginBottom: 4}} id="bioField" label="BioDialog" multiline rows={4}
                       size="medium" margin="normal" variant="outlined"
                       value={bio} onChange={handleBioChange} fullWidth/>
            <Button variant="outlined" onClick={handleSubmit}>Submit</Button>
        </>
    )
};

export default Profile;