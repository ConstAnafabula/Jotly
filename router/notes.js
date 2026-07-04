const express = require('express')
const router = express.Router()
const path = require('path')
const db = require('../db/database')

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'notes.html'))
})
router.get('/create', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'create.html'))
})
router.route('/api')
    .get((req, res) => {
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
        const query = `SELECT * FROM notes WHERE title LIKE ? AND (? = 'all' OR tag = ?) AND is_draft = 0 ${orderBy}`
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
    .post((req, res) => {
        const {title, content, tag, fav, draft} = req.body
        if (typeof title !== 'string' || typeof content !== 'string' || typeof tag !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Invalid input'
            })
        }
        if (!title?.trim() || !content?.trim() || !tag?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Title, content, and tag are required.'
            })
        }
        if (typeof fav !== 'boolean' || typeof draft !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Invalid favorite and draft value'
            })
        }
        if (title.length > 120) {
            return res.status(400).json({
                success: false,
                message: 'Title must not exceed 120 characters'
            })
        }
        const query = 'INSERT INTO notes (title, content, tag, created_at, updated_at, is_draft, is_favorite) VALUES (?, ?, ?, datetime("now", "+8 hours"), datetime("now", "+8 hours"), ?, ?)'
        db.run(query, [title, content, tag, draft, fav], function (err) {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    success: false,
                    message: 'Internal Server Error'
                })
            }
            res.status(201).json({
                success: true,
                message: 'Note saved successfully',
                id: this.lastID
            })
        })
    })
module.exports = router