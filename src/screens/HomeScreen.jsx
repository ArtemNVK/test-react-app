import React, { useCallback, useEffect, useRef, useState } from 'react'
import ImagePreviewComponent from '../components/ImagePreviewComponent/ImagePreviewComponent'
import { v4 as uuidv4 } from 'uuid';
import useImages from '../customHooks/useImages'
import styles from './HomeScreen.module.css';

export default function HomeScreen() {
    const [start, setStart] = useState(0);
    const [imagesToDisplay, setImagesToDisplay] = useState([]);  
    const [imageToDelete, setImageToDelete] = useState(null);
    const [filterByAlbumId, setFilterByAlbumId] = useState('All');
    const {
        images,
        hasMore,
        loading,
        error
      } = useImages(start, imageToDelete, filterByAlbumId)
    console.log(filterByAlbumId)
    useEffect(() => {
        if (images) {
            setImagesToDisplay([...new Set(images)]);
        }
    }, [images]);

    const handleDelete = (id) => {
        setImageToDelete(id);
        setImagesToDisplay(imagesToDisplay.filter(image => image.id !== id));
    }

    const observer = useRef()
    const lastImageElementRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
            setStart(prevStart => prevStart + 100)
        }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    const handleFilterByAlbumId = (e) => {
        setFilterByAlbumId(e.target.value);
    }
    console.log(imagesToDisplay);
    return (
        <>
        {error && <p>Something went wrong</p>}
        {imagesToDisplay.length > 0 && (
        <div className={styles.root}>
            <div className={styles.imagesContainer}>
            <div className={styles.filtersBar}>
                <select name="albums" id="albums" value={filterByAlbumId} onChange={handleFilterByAlbumId}>
                    {[...Array(101)].map((x, i) => 
                        <option value={i} key={uuidv4()}>{i === 0 ? 'All' : i}</option>
                    )}
                </select>
            </div>
            {imagesToDisplay.map((img, index) => {
                    if (filterByAlbumId > 0) {
                        return (
                        <div key={uuidv4()}>
                            <ImagePreviewComponent img={img} handleDelete={handleDelete} />
                        </div>
                        )
                    }
                    if (imagesToDisplay.length === index + 1) {
                        return (
                        <div ref={lastImageElementRef} key={uuidv4()}>
                            <ImagePreviewComponent img={img} handleDelete={handleDelete} />
                        </div>
                        )
                    } else {
                        return (
                        <div key={uuidv4()}>
                            <ImagePreviewComponent img={img} handleDelete={handleDelete} />
                        </div>
                        )
                    }
            })}
            </div>
        </div>
        )}
        {loading && <p>Loading ...</p>}
        </>
    )
}
