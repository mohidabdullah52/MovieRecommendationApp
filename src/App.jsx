import React, { useEffect, useMemo, useState } from 'react'
import Search from './components/search.jsx'
import MovieCard from './components/MovieCard.jsx'
import { useDebounce } from 'react-use';
import Spinner from './components/spinner.jsx'

const API_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN || "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZjFjMDllZDEwMjYxYWQ0ZTc0YjZhMjViMzQ3NzBiYyIsIm5iZiI6MTc3NDYzMTU3Mi44MDE5OTk4LCJzdWIiOiI2OWM2YmE5NDQ1YzZiZmM2YWU4OWJkZjQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.z-3bYZJIQDVEXApwc2lO3QzDuGvHVnTTSW_5EdYLspA"
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "ef1c09ed10261ad4e74b6a25b34770bc"

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    ...(TMDB_ACCESS_TOKEN ? { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` } : {}),
  }
}

const App = () => {

  const[searchTerm,setSearchTerm] = useState('');
  const[errorMessage,setErrorMessage] = useState('');
  const[movieList,setMovieList] = useState([]);
  const[isLoading,setIsLoading] = useState(false);
  const [debouncedSearchTerm,setDebouncedSearchTerm] = useState('');
  const [ratingSort,setRatingSort] = useState(false);

  useDebounce(
    () => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]
  );
  const fetchMovies = (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    const normalizedQuery = String(query).trim();
    const endpoint = normalizedQuery
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(normalizedQuery)}${TMDB_ACCESS_TOKEN ? '' : `&api_key=${TMDB_API_KEY}`}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc${TMDB_ACCESS_TOKEN ? '' : `&api_key=${TMDB_API_KEY}`}`;

    fetch(endpoint, API_OPTIONS)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`${response.status} ${response.statusText}: ${text}`)
          })
        }
        return response.json()
      })
      .then((data) => {
        setMovieList(data.results || [])
        console.log('TMDB results:', data?.results?.slice?.(0, 3) ?? data)
      })
      .catch((error) => {
        console.error(`Error fetching Movies: ${error}`)
        setErrorMessage(`Error occurred while fetching: ${error}`)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  const displayedMovies = useMemo(() => {
    if (!ratingSort) return movieList
    return [...movieList].sort(
      (a, b) => (b?.vote_average ?? 0) - (a?.vote_average ?? 0)
    )
  }, [movieList, ratingSort])
  return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>

        <header>
          <img src="./hero.png" alt="" />
          <h1 className='text-white'>
            Find <span className='text-gradient'>Movies</span> without any hassle
          </h1>
          <p className='mt-3 text-center text-light-200'>
            Search your favorite movies quickly.
          </p>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>
          <button className='bg-purple-500 text-white px-4 py-2 rounded-md' onClick={() => setRatingSort(!ratingSort)}>Sort by Rating</button>
          {isLoading? (
          <div className="loader"></div>
          ) : errorMessage ? (
            <p className='text-red-500'>Error:{errorMessage}</p>
          ): (
            <ul>
              {displayedMovies.map((movie) => (
                <li key={movie.id}>
                  <MovieCard movie={movie} />
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </main>
  )
}

export default App