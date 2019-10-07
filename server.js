require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIEDEX = require('./moviedex.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
  console.log('validation ran');
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
   return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
})

app.get('/movie', function handleGetMovies(req, res) {
  const { genre = '', country = '', avg_vote = ''} = req.query
  let response = MOVIEDEX;

  if (!genre && !country && !avg_vote) {
    return res
      .status(400)
      .send('Request must include a genre, country, or average vote')
  }

  if (genre) {
    response = response.filter(movies =>
      movies.genre.toLowerCase().includes(genre.toLowerCase())
    )
  }

  if (country) {
    response = response.filter(movies =>
      movies.country.toLowerCase().includes(country.toLowerCase())
    )
  }

  if (avg_vote) {
    response = response.filter(movies =>
      Number(movies.avg_vote) >= Number(avg_vote)
    )
  }

  res.json(response)
})

// fdd1e8e6-e940-11e9-81b4-2a2ae2dbcce4

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
