import {Box, Button, DialogContent, Divider, Typography} from "@mui/material";
import MPFileInput from "../common/MPFileInput";
import {useState} from "react";
import photoapi from "../api/photoapi";
import MPDialog from "../common/MpDialog";
import MPProgress from "../common/MPProgress";

const Local: React.FC = () => {

    const [files, setFiles] = useState<FileList|null> ()
    const [percent, setPercent] = useState<number> (0)
    const [uploadDisabled, setUploadDisabled] = useState(true)

    const [openDownload, setOpenDownload] = useState(false)

    const handleFileChange = (event: FileList|null) => {
        if(event && event.length > 0)
            setUploadDisabled(false)
        else
            setUploadDisabled(true)
        setFiles(event)
    }


    const handleUpload = () => {
        const upload = async () => {

        }
        //setOpenDownload(true)
        if(files && files.length > 0) {
            alert("uploading local photo")
            photoapi.uploadLocalPhoto(files[0]).then(res => alert("source: "+res)).catch(err => alert("err: "+err.toString()))
        }
    }

    return (
        <Box>
            <Typography variant="body1" paragraph={true}>
                Upload photos from your local computer. Any folders that has already been uploaded (md5 check) will
                not be uploaded again. Observe that the md5 check happens on the server
            </Typography>
            <MPFileInput onChange={handleFileChange} multi={true} acceptMimeTypes={"image/jpeg"}/>
            <Button sx={{ mt: 2 }}  disabled={uploadDisabled} variant="outlined" onClick={handleUpload}>Upload Photos</Button>
            <MPDialog open={openDownload}
                      onClose={() => setOpenDownload(false)}
                      title={"Upload Photo Progress"}
                      closeText={"Done"}>
                <MPProgress value={percent}/>
            </MPDialog>
        </Box>
    )
}

export default Local
