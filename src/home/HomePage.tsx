import {useContext} from "react";
import {MPContext} from "../App";
import Bio from "./Bio";
import InfinitePhotoGrid from "./InfinitePhotoGrid";
import {styled} from "@material-ui/core/styles";

const RootDiv = styled('div')(({theme}) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    paddingLeft: 0,
    maxWidth: 1024,
    margin: 'auto',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
}))

export default function HomePage() {
    const context = useContext(MPContext)

    return (
        <RootDiv>
            {context.uxConfig.showBio &&
            <Bio/>
            }
            <InfinitePhotoGrid fetchItems={context.uxConfig.photoItemsLoad}
                               columns={context.uxConfig.photoGridCols}
                               spacing={context.uxConfig.photoGridSpacing} order="drive"/>
        </RootDiv>
    );

}