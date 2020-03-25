import { lowerCase } from 'lodash'
import axios from 'axios'

const { HOSTNAME, NOTES_PORT, LOGS_PORT } = process.env
const baseUrl = `http://${HOSTNAME}`

module.exports = (app) => {
  app.get('/notes', (req, res) => {
    const { query: { keyword } } = req
    // calling notes service to retreive notes of respective keyword
    let url = `${baseUrl}:${NOTES_PORT}/notes`
    axios({ method: 'GET', url, params: { keyword: lowerCase(keyword) } })
      .then(({ data }) => {
        res.status(201)
        res.send(data)
      })
      .catch(err => {
        res.status(404)
        res.send({ message: 'Oops! Something went wrong.', err })
      })
  })

  app.post('/notes', (req, res) => {
    const { body: { data: { keyword, note } } } = req
    // calling notes service to add note for respective keyword
    let url = `${baseUrl}:${NOTES_PORT}/notes`
    axios({ method: 'POST', url, data: { keyword: lowerCase(keyword), note } })
      .then(() => {
        res.status(201)
        res.send({ message: `Note added for "${keyword}" successfully!` })
      })
      .catch(err => {
        res.status(404)
        res.send({ message: 'Oops! Something went wrong.', err })
      })
  })

  app.get('/search', async (req, res) => {
    const { query: { keyword } } = req
    let url = `${baseUrl}:${LOGS_PORT}/logs`
    await axios({ method: 'POST', url, data: { keyword: lowerCase(keyword) } })
      .then(({ data }) => res.send(data))
      .catch(err => {
        console.log(err)
        res.send({ message: 'Oops! Something went wrong.', err })
      })
  })
}
