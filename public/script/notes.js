const notesGrid = document.getElementById('notes-grid')
const emptyState = document.getElementById('empty-state')
const notesCount = document.getElementById('notes-count')
const noteSearch = document.getElementById('note-search')
const filterTag = document.getElementById('filter-tag')
const sortNotes = document.getElementById('sort-notes')
const emptyStateText = document.getElementById('empty-state-text')

async function loadAllNotes() {
    const result = await fetchNotes(getFilters())
    console.log(result);
    
    if (!result.success) {
        alert(result.message)
        return
    }
    getTags(result.data)
    displayNotesCount(result.data)
    displayAllNotes(result.data)
    checkEmptyState(result.data)
}
let tagsLoaded = false;
function getTags(tags) {
    if (tagsLoaded) return;

    const tag = tags.map(t => t.tag);
    displayFilterTags(tag);
    tagsLoaded = true;
}
function createdDateToString(date) {
    return date.map(d => 
        new Date(d.created_at).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    )
}
function updatedDateToString(date) {
    return date.map(d => 
        new Date(d.updated_at).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    )
}
function displayFilterTags(notes) {        
    const unique = [...new Set(notes)]
    const option = unique.map(u => {
        return`
        <option value="${u}">${u.charAt(0).toUpperCase() + u.slice(1)}</option>
        `
    }).join('')
    filterTag.innerHTML += option    
}
function displayNotesCount(notes) {
    notesCount.textContent = `${notes.length} notes`    
}
function displayAllNotes(notes) {
    const created = createdDateToString(notes)
    const updated = updatedDateToString(notes)
    const note = notes.map((n, index) => {
        return`
        <article class="note-card" role="listitem" data-note-id="${n.id}" data-tag="${n.tag}">
            <div class="note-card-accent nc-${n.tag}" aria-hidden="true"></div>
            <div class="note-header">
                <h3 class="note-title">${n.title}</h3>
                <span class="note-tag ntag-${n.tag}">${n.tag.charAt(0).toUpperCase() + n.tag.slice(1)}</span>
            </div>
            <p class="note-body">${n.content}</p>
            <footer class="note-footer">
                <div class="note-meta-row">
                    <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span class="meta-key">Created at</span>
                    <span class="meta-val">${created[index]}</span>
                </div>
                <div class="note-meta-row">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span class="meta-key">Updated at</span>
                    <span class="meta-val">${updated[index]}</span>
                </div>
            </footer>
        </article>
        `
    }).join('')
    notesGrid.innerHTML = note
}
function checkEmptyState(total) {
    if (total.length === 0) {
        emptyState.classList.add('is-visible')
        emptyStateText.textContent = noteSearch.value ? `Create your first "${noteSearch.value}" note to start organizing your ideas.` : 'Create your first note to start organizing your ideas.';    } else {
        emptyState.classList.remove('is-visible')
    }
}
function getFilters() {
    return {
        search: noteSearch.value.trim(),
        tag: filterTag.value || 'all',
        sort: sortNotes.value  
    }
}
noteSearch.addEventListener('input', loadAllNotes)
filterTag.addEventListener('change', loadAllNotes)
sortNotes.addEventListener('change', loadAllNotes)
loadAllNotes()
