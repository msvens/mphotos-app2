import {Link as RouterLink} from "react-router-dom";
import {useEffect, useState} from "react";
import {Photo, PhotoType} from "../api/types";
import PhotosApi from "../api/photoapi";
import InfiniteScroll from "react-infinite-scroll-component";
import {ImageList, ImageListItem} from "@mui/material";
import {styled} from "@mui/system";

interface InfinitePhotoGridProps {
    fetchItems: number,
    columns: number,
    spacing: number,
    order: "original" | "drive"
}

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

const ThumbPrivate = styled('img')({
        width: '100%',
        height: '100%',
        opacity: 0.5,

})

const InfinitePhotoGrid: React.FC<InfinitePhotoGridProps> = (props: InfinitePhotoGridProps) => {

    const [photos, setPhotos] = useState<Photo[]>([]);
    const [offset, setOffset] = useState<number> (0);
    const [hasMore, setHasMore] = useState<boolean> (true);

    useEffect(() => {
        PhotosApi.getPhotos(props.fetchItems, 0).then(res => {
            if(res.length < props.fetchItems)
                setHasMore(false);
            if(res.length > 0) {
                setPhotos(res.photos)
                setOffset(res.length)
            }
        });
    }, [props.fetchItems]);

    const fetchMoreData = () => {
        PhotosApi.getPhotos(props.fetchItems, offset).then(res => {
            if(res.length < props.fetchItems)
                setHasMore(false);
            if(res.length > 0) {
                setPhotos(photos.concat(res.photos))
                setOffset(offset + res.length)
            }
        })
    }

    return (
        <RootDiv>
            <InfiniteScroll
                dataLength={photos.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                    <div/>
                }
                style={{margin: 'auto' }}
            >
                <ImageList cols={props.columns} rowHeight={'auto'} gap={props.spacing}>
                    {photos.map(photo => (
                        <ImageListItem sx={{width: '100%', height: '100%'}} cols={1} key={photo.id}>
                            <RouterLink to={`/photo/${photo.id}`}>
                                {photo.private
                                    ? <ThumbPrivate alt={photo.fileName}
                                                     src={PhotosApi.getImageUrl(photo, PhotoType.Thumb, false, false)}/>
                                    : <Thumb alt={photo.fileName}
                                                     src={PhotosApi.getImageUrl(photo, PhotoType.Thumb, false, false)}/>
                                }

                            </RouterLink>
                        </ImageListItem>
                    ))}
                </ImageList>
            </InfiniteScroll>
        </RootDiv>
    );
};

export default InfinitePhotoGrid