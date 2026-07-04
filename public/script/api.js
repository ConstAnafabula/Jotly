async function getNotes() {
    const response = await fetch('/api')
    return await response.json()
}
async function getAllNotes() {
    const response = await fetch('/notes/api')
    return await response.json()
}
async function fetchNotes(filter) {
    const params = new URLSearchParams(filter)
    const response = await fetch(`/notes/api?${params}`)
    return await response.json()
}
async function postNote(note) {
    const response = await fetch('/notes/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(note)
    })
    if (!response.ok) {
        throw new Error('Failed to save note')
    }
    return await response.json()
}