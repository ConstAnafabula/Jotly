const toast = document.getElementById('toast')
const sideBar = document.getElementById('sidebar-card')
const bodyCard = document.getElementById('body-card')
const tagRadios = document.querySelectorAll('.tag-radio');
const titleAccent = document.getElementById('title-accent');
const previewAccent = document.getElementById('preview-accent');
const previewTag = document.getElementById('preview-tag');

  /* ── Title ──────────────────────────────────────────────── */
const titleInput = document.getElementById('note-title');
const charCount = document.getElementById('char-count');
const previewTitle = document.getElementById('preview-title');

  /* ── Body / word count ──────────────────────────────────── */
const bodyInput = document.getElementById('note-body');
const wordCount = document.getElementById('word-count');
const previewBody = document.getElementById('preview-body');

  /* ── Live date ──────────────────────────────────────────── */
const previewDate = document.getElementById('preview-date');
const now = new Date();

const toggles = document.querySelectorAll('.toggle');
const saveButton = document.getElementById('save-note-btn');

const tagAccentMap = {
    work:       'var(--violet)',
    technology: 'var(--sky)',
    personal:   'var(--emerald)',
    health:     'var(--amber)',
    books:      'var(--rose)',
    travel:     'var(--navy)',
};

async function fetchData() {
    saveButton.addEventListener('click', async () => {
        const title = titleInput.value.trim()
        const body = bodyInput.value.trim()
        const data = sendData()
        if (!title) {
            return
        }
        if (!getSelectedTag()) {
            return
        }
        if (!body) {
            return
        }
        const result = await postNote(data)
        setUpToast(result.message)
    })
}
function setUpToast(message) {
    toast.textContent = message
    toast.classList.add('show')

    setTimeout(() => {
        toast.classList.remove('show')
    }, 3000);
}
function clearFields() {
    titleInput.value = ""
    bodyInput.value = ""
    previewTitle.textContent = ""
    previewBody.textContent = ""
    previewTag.textContent = ""
    previewTag.className = "preview-tag"
    tagRadios.forEach(radio => {
        radio.checked = false
    })
}
function setupTagPreview() {
    tagRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const tag = radio.value;
            const color = tagAccentMap[tag];
            titleAccent.style.background = color;
            previewAccent.style.background = color;

            // Update preview tag
            previewTag.textContent = radio.closest('.tag-option').querySelector('.tag-option-label').textContent;
            previewTag.className = 'preview-tag ntag-' + tag;
        
            sideBar.classList.remove('input-error');
        });
    });
}
function setupTitlePreview() {
    titleInput.addEventListener('input', () => {
        const len = titleInput.value.length;
        charCount.textContent = len + ' / 120';
        previewTitle.textContent = titleInput.value.trim() || 'Untitled note';
    });
}
function setupBodyPreview() {
    bodyInput.addEventListener('input', () => {
        const text = bodyInput.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        wordCount.textContent = words + (words === 1 ? ' word' : ' words');
        previewBody.textContent = text.slice(0, 100) + (text.length > 100 ? '…' : '') || 'Your note preview will appear here as you write.';
    });
}
function setupPreviewDate() {
    previewDate.textContent = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function setupToggles() {
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const checked = toggle.getAttribute('aria-checked') === 'true';
            toggle.setAttribute('aria-checked', String(!checked));
        });
    });
}
function setupSaveButton() {
    saveButton.addEventListener('click', () => {
        tagRadios.forEach(radio => {
            const title = titleInput.value.trim();
            const body = bodyInput.value.trim()
            if (!title) {
                titleInput.focus();
                titleInput.classList.add('input-error');
                return;
            }
            if (!getSelectedTag()) {
                radio.focus()
                sideBar.classList.add('input-error')
                return
            }
            if (!body) {
                bodyCard.classList.add('input-error')
                bodyCard.focus()
                return
            }
            clearFields()
            titleInput.classList.remove('input-error');
            bodyCard.classList.remove('input-error')
        })
    });    
}
function setupTitleValidation() {
    titleInput.addEventListener('input', () => {
        titleInput.classList.remove('input-error');
    });
}
function init() {
    setupTagPreview()
    setupTitlePreview()
    setupBodyPreview()
    setupPreviewDate()
    setupToggles()
    setupSaveButton()
    setupTitleValidation()
}
function getToggleValues() {
    const fav = document.getElementById('toggle-fav').getAttribute('aria-checked') === 'true'
    const draft = document.getElementById('toggle-draft').getAttribute('aria-checked') === 'true'
    return { fav, draft }
}
function getSelectedTag() {
    const selected = [...tagRadios].find(radio => radio.checked)
    return selected?.value
}
function sendData() {
    const title = titleInput.value
    const body = bodyInput.value
    const tag = getSelectedTag()
    const {fav, draft} = getToggleValues()
    return {
        title: title,
        content: body,
        tag: tag,
        fav: fav,
        draft: draft
    }    
}
fetchData()
init()