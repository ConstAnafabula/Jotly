const express = require('express')
const app = express()
const db = require('./db/database')
const PORT = process.env.PORT || 3000
const path = require('path')
const notesRouter = require('./router/notes')

app.use('/notes', notesRouter)
app.use(express.json())
app.use(express.static('public'))
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next()
})
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html')
})
app.get('/api', (req, res) => {
    const getNotesQuery = 'SELECT * FROM notes LIMIT 10'
    const getTotalQuery = `SELECT 
                        COUNT(*) AS totalNotes, 
                        SUM(CASE WHEN DATE(created_at) = DATE('now') THEN 1 ELSE 0 END) AS notesToday, 
                        SUM(CASE WHEN strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now') THEN 1 ELSE 0 END) AS monthNotes, 
                        SUM(CASE WHEN DATE(created_at) = DATE('now', '-1 day') THEN 1 ELSE 0 END) as totalYesterday, 
                        SUM(CASE WHEN DATE(created_at) != DATE(updated_at) AND DATE(updated_at) = DATE('now', '-7 days') THEN 1 ELSE 0 END) AS updatedNotes,
                        SUM(CASE WHEN DATE(created_at) = DATE('now', '-7 days') THEN 1 ELSE 0 END) AS weekNotes, 
                        (SELECT tag FROM notes WHERE tag IS NOT NULL AND tag != '' GROUP BY tag ORDER BY COUNT(*) DESC LIMIT 1) AS mostUsedTag, 
                        (SELECT updated_at FROM notes WHERE created_at != updated_at ORDER BY updated_at DESC LIMIT 1) as lastUpdated FROM notes;` 
    db.all(getNotesQuery, [], (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            })
        }
        db.get(getTotalQuery, [], (err, total) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: 'Internal Server Error'
                })
            }    
            res.json({
                success: true,
                data: {
                    total: total,
                    notes: rows
                }
            })
        })
    })
})
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})