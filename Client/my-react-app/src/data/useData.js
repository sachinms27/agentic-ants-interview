import { useState, useEffect, useCallback } from 'react'
import { fetchData, fetchPosts, fetchUser } from './api'

export const useData = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchData()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const getPosts = useCallback(async (limit = 10) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchPosts(limit)
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const getUser = useCallback(async (userId) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchUser(userId)
      setData([result])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearData = useCallback(() => {
    setData([])
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    data,
    loading,
    error,
    getData,
    getPosts,
    getUser,
    clearData,
    clearError,
  }
}
