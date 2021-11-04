/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useImages(start, imageToDelete, filterByAlbumId) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [images, setImages] = useState([])
  const [dataLength, setDataLength] = useState();
  const [hasMore, setHasMore] = useState(false)

  const limit = 100;

  useEffect(() => {
    axios({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/photos',
    }).then(res => {
      setDataLength(res.data.length - 1)
    }).catch(e => {
      if (axios.isCancel(e)) return
    })
  }, []);

  useEffect(() => {
    setLoading(true)
    setError(false)

    if (filterByAlbumId === 'All') {
      axios({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/photos?',
        params: { _start: start, _limit: limit },
      }).then(res => {
        setImages(prevData => {
          return [...new Set([...prevData, ...res.data])]
        })
        setHasMore(start <= (dataLength - limit))
        setLoading(false)
      }).catch(e => {
        if (axios.isCancel(e)) return
        setError(true)
      })
    } else {
      axios({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/photos?',
        params: filterByAlbumId > 0 ? { albumId: filterByAlbumId } : { _start: start, _limit: limit } ,
      }).then(res => {
        setImages(prevData => {
          return filterByAlbumId > 0 ? [...new Set([...res.data])] : [...new Set([...prevData, ...res.data])]
        })
        setHasMore(start <= (dataLength - limit))
        setLoading(false)
      }).catch(e => {
        if (axios.isCancel(e)) return
        setError(true)
      })
    }


  }, [dataLength, start, filterByAlbumId])

  useEffect(() => {
    if (imageToDelete) {
      setImages(images.filter(image => image.id !== imageToDelete));
    }
  }, [imageToDelete]);

  return { loading, error, images, hasMore }
}
