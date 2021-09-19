import {BrowserRouter as Router, Route, Switch, useLocation} from "react-router-dom";
import {useEffect} from "react";
import TopBar from "./TopBar";
import ResumePage from "./resume/Resume";
import AboutPage from "./about/AboutPage";
import {Box} from "@mui/material";
import {styled} from "@mui/system";
import BottomBar from "./BottomBar";
import HomePage from "./home/HomePage";
import GuestPage from "./guest/GuestPage";
import PhotoPage from "./photo/PhotoPage";
import CameraPage from "./camera/CameraPage";
import UserPage from "./user/UserPage";
import AlbumPage from "./album/AlbumPage";

function ScrollToTop() {
    const {pathname} = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

const RootDiv = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 0,
    minHeight: '100vh',
})

const MPhotos: React.FC = () => {
    return (
        <Router>
            <ScrollToTop/>
            <RootDiv>
                <TopBar showSearch={false}/>
                <Box sx={{flexGrow: 1}}>
                    <Switch>
                        <Route path="/album/:albumId"><PhotoPage/></Route>
                        <Route path="/album" render={() => <AlbumPage/>}/>
                        <Route path="/camera/:cameraId"><CameraPage/></Route>
                        <Route path="/camera"><CameraPage/></Route>
                        <Route path="/resume" render={() => <ResumePage/>}/>
                        <Route path="/photo/:photoId"><PhotoPage/></Route>
                        <Route path="/photo" render={() => <PhotoPage/>}/>
                        <Route path="/about" render={() => <AboutPage/>}/>
                        <Route path="/user/:setting"><UserPage/></Route>
                        <Route path="/user" render={() => <UserPage/>}/>
                        <Route path="/guest"><GuestPage/></Route>
                        <Route path="/" render={() => <HomePage/>}/>
                    </Switch>
                </Box>
                <BottomBar/>
            </RootDiv>
        </Router>
    );
}

export default MPhotos