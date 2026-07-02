const express = require('express')
const router = express.Router()
const path = require('path')
const db = require('../db/database')

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'notes.html'))
})
router.get('/api', (req, res) => {
    const sort = req.query.sort
    const tag = req.query.tag
    const title = `%${req.query.search || ''}%` 
    let orderBy
    switch(sort) {
        case 'newest':
            orderBy = 'ORDER BY created_at DESC'
            break
        case 'oldest':
            orderBy = 'ORDER BY created_at ASC'
            break
        case 'updated':
            orderBy = 'ORDER BY updated_at DESC'
            break
        case 'alphabetical':
            orderBy = 'ORDER BY title ASC'
            break
        default:
            orderBy = 'ORDER BY created_at DESC'
        }
    const query = `SELECT * FROM notes WHERE title LIKE ? AND (? = 'all' OR tag = ?) ${orderBy}`
    db.all(query, [title, tag, tag], (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            })
        }
        res.json({
            success: true,
            data: rows
        })
    })
})
module.exports = router