import {
    Box, Button, Dialog,
    DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    LinearProgress,
    LinearProgressProps,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {Job, JobState} from "../api/types";
import PhotosApi from "../api/photoapi";
import {useInterval} from "../hooks/useTimers";
import MPProgress from "../common/MPProgress";

type DownloadDrivePhotosProps = {
    open: boolean,
    onClose: () => void
}



const DownloadDrivePhotos: React.FC<DownloadDrivePhotosProps> = ({open, onClose}) => {

    const [job, setJob] = useState<Job>()
    const delay = 500
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [numPhotos, setNumPhotos] = useState<number>(0)

    const checkJob = () => {
        const check = async () => {
            if (job) {
                const res = await PhotosApi.statusDriveAddPhotosJob(job.id)
                switch (res.state) {
                    case JobState.FINISHED:
                        setIsRunning(false)
                        break
                    case JobState.ABORTED:
                        setIsRunning(false)
                        alert("Job Aborted " + job.error)
                        break
                }
                setJob(res)
            } else {
                setIsRunning(false)
                alert("no job defined")
            }
        }
        check()
    }

    useInterval(checkJob, isRunning ? delay : null)


    useEffect(() => {
        if (job === undefined) {
            PhotosApi.checkDrive().then(res => setNumPhotos(res.length)).catch(err => console.log(err))
        }
    }, [job])


    const handleDownload = () => {
        const scheduleJob = async () => {
            const res = await PhotosApi.scheduleDriveAddPhotosJob()
            if (res.state === JobState.STARTED || res.state === JobState.SCHEDULED) {
                setIsRunning(true)
                setJob(res)
            } else {
                alert(res.state)
            }
        }
        scheduleJob()
    }

    const Content: React.FC = () => {
        if (job) {
            return (
                <>
                    <DialogTitle id="dialog-title">Download Progress</DialogTitle>
                    <DialogContent>
                        <MPProgress value={job.percent}/>
                    </DialogContent>
                    <DialogActions>
                        <Button disabled={isRunning} onClick={() => {
                            onClose()
                            setJob(undefined)
                        }} color="primary" autoFocus>
                            Ok
                        </Button>
                    </DialogActions>
                </>
            )
        } else {
            return (
                <>
                    <DialogTitle id="dialog-title">Download Photos From Your Drive Folder</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="dialog-content">
                            There are current {numPhotos} photos to download from your drive folder
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} color="primary">
                            Cancel
                        </Button>
                        <Button disabled={numPhotos === 0} onClick={handleDownload} color="primary" autoFocus>
                            Ok
                        </Button>
                    </DialogActions>
                </>
            )
        }
    }

    return (
        <Dialog open={open} aria-labelledby="dialog-title" aria-describedby="dialog-content"
                fullWidth maxWidth='md'>
            <Content/>
        </Dialog>
    )
}

export default DownloadDrivePhotos