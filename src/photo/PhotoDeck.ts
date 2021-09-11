import {Photo} from "../api/types";

export class PhotoDeck {
    private photos: Photo[]
    private idx: number


    constructor(photos?: Photo[], idx?: number) {
        this.photos = photos ? photos : []
        this.idx = idx ? idx : 0
    }

    isEmpty(): boolean {
        return this.photos.length === 0
    }

    hasPhotos(): boolean {
        return this.photos.length > 0
    }

    get(): Photo {
        if(this.isEmpty())
            throw new Error("no photo")
        return this.photos[this.idx]
    }

    driveId(): string {
        return this.get().driveId
    }

    delete(): PhotoDeck {
        const driveId = this.get().driveId
        const newPhotos = this.photos.filter(p => p.driveId !== driveId)
        const newIdx = this.idx >= newPhotos.length ? 0 : this.idx
        return new PhotoDeck(newPhotos, newIdx)
    }

    update(p: Photo): PhotoDeck {
        const newPhotos = this.photos.map((photo) => {
            if (photo.driveId === p.driveId) {
                return p
            } else
                return photo
        })
        return new PhotoDeck(newPhotos, this.idx)
    }

    next(): PhotoDeck {
        const newIdx = this.idx + 1 >= this.photos.length ? 0 : this.idx + 1
        return new PhotoDeck(this.photos, newIdx)
    }

    previous(): PhotoDeck {
        const newIdx = this.idx - 1 < 0 ? this.photos.length - 1 : this.idx - 1
        return new PhotoDeck(this.photos, newIdx)
    }
}