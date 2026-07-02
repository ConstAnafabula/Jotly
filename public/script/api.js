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