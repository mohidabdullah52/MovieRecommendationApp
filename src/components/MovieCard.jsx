import React from 'react'

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

const MovieCard = ({ movie }) => {
  const posterUrl = movie?.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null
  const title = movie?.title ?? 'Untitled'
  const year = movie?.release_date?.slice?.(0, 4) ?? '—'
  const lang = movie?.original_language ?? '—'
  const rating = typeof movie?.vote_average === 'number' ? movie.vote_average.toFixed(1) : '—'

  return (
    <div className='movie-card'>
      {posterUrl ? <img src={posterUrl} alt={title} loading='lazy' /> : null}

      <h3>{title}</h3>

      <div className='content'>
        <span className='year'>{year}</span>
        <span>•</span>
        <span className='lang'>{lang}</span>
      </div>

      <div className='rating' aria-label={`Rating: ${rating}`}>
        <p>⭐{rating}</p>
      </div>
    </div>
  )
}

export default MovieCard

