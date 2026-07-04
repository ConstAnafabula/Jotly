const notesGrid = document.querySelector('.notes-grid')
const totalNotes = document.getElementById('totalValue')
const totalToday = document.getElementById('todayValue')
const totalMonth = document.getElementById('monthNotes')
const vsYesterday = document.getElementById('vsYesterday')
const totalUpdated = document.getElementById('updatedValue')
const mostTag = document.getElementById('mostTag')
const lastCreated = document.getElementById('todayLastCreated')
const lastEdited = document.getElementById('lastEdited')
const wDate = document.getElementById('welcome-date')
const wHeading = document.getElementById('welcome-heading')
const wSub = document.getElementById('welcome-sub')

async function loadNotes() {    
    const result = await getNotes()

    if (!result.success) {
        alert(result.message)
        return
    }
    displayNotes(result.data.notes)
    displayTotals(result.data.total)
    giveClassDelta(result.data.total.monthNotes)
    compareTodayAndYesterday(result.data.total.notesToday, result.data.total.totalYesterday)
    cardFooterDisplay(result.data.total, result.data.notes)
    displayWelcome(result.data.total)
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
function displayTotals(totals) {
    totalNotes.textContent = totals.totalNotes
    totalToday.textContent = totals.notesToday
    totalMonth.textContent = `↑ ${totals.monthNotes} this month`
    totalUpdated.textContent = totals.updatedNotes
}
function displayNotes(notes) {
    const created = createdDateToString(notes)
    const updated = updatedDateToString(notes)
    
    const note = notes.map((n, index) => {
        return`
        <article class="note-card" role="listitem">
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
function giveClassDelta(notes) {
    if (Number(notes) === 0) {
        totalMonth.classList.remove('delta-up')
        totalMonth.classList.add('delta-inactive')
    } else {
        totalMonth.classList.remove('delta-inactive')
        totalMonth.classList.add('delta-up')
    }
}
function compareTodayAndYesterday(today, yesterday) {
    if (Number(today) > Number(yesterday)) {
        const result = Number(today) - Number(yesterday)
        vsYesterday.classList.remove('delta-down', 'delta-inactive', 'delta-stable')
        vsYesterday.classList.add('delta-up')
        vsYesterday.textContent = `↑ ${result} vs yesterday`
    } else if (Number(today) < Number(yesterday)) {
        const result = Number(yesterday) - Number(today)
        vsYesterday.classList.remove('delta-up', 'delta-inactive', 'delta-stable')
        vsYesterday.classList.add('delta-down')
        vsYesterday.textContent = `↓ ${result} vs yesterday`
    } else if (Number(today) === 0 || Number(yesterday) === 0) {
        vsYesterday.classList.remove('delta-up', 'delta-down', 'delta-stable')
        vsYesterday.classList.add('delta-inactive')
        vsYesterday.textContent = `No notes today`
    } else if (Number(today) > 0 || Number(yesterday) > 0) {
        if (Number(today) === Number(yesterday)) {
            vsYesterday.classList.remove('delta-up', 'delta-down', 'delta-inactive')
            vsYesterday.classList.add('delta-stable')
            vsYesterday.textContent = `→ Same as yesterday`
        }
    }
}
function cardFooterDisplay(totals, notes) {
    const created = createdDateToString(notes)
    const updated = new Date(totals.lastUpdated).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
    mostTag.textContent = `Most used tag: ${totals.mostUsedTag.charAt(0).toUpperCase() + totals.mostUsedTag.slice(1)}`
    lastCreated.textContent = `Last note created: ${created[notes.length - 1]}`    
    lastEdited.textContent = `Last note updated: ${updated}`
}
function displayWelcome(totals) {
    wDate.textContent = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    wHeading.innerHTML = `
        Good morning,
        <em class="welcome-name">Kaizer</em>
    `;
    if (Number(totals.weekNotes) === 0) {
        wSub.textContent = "You haven't written any notes this week — let's start with your first one!";
    } else if (Number(totals.weekNotes) === 1) {
        wSub.textContent = "You've written 1 note this week — keep the momentum going.";
    } else {
        wSub.textContent = `You've written ${totals.weekNotes} notes this week — keep the momentum going.`;
    }
}
loadNotes()