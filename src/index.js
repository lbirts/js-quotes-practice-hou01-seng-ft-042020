const quotesList = document.getElementById("quote-list")
const quotesURL = "http://localhost:3000/quotes"
const quoteForm = document.getElementById("new-quote-form")

function getQuotes() {
    return fetch(quotesURL + `?_embed=likes`)
        .then(res => res.json())
}

function renderQuotes(quote) {
    const qLi = document.createElement("li")
    const qBlock = document.createElement("blockquote")
    const qP = document.createElement("p")
    const qFooter = document.createElement("footer")
    const lineBreak = document.createElement("br")
    const qBtn = document.createElement("button")
    const btnSpan = document.createElement("span")
    const qDelete = document.createElement("delete")

    qLi.className = "quote-card"
    qBlock.className = "blockquote"
    qP.className = "mb-0"
    qP.innerText = quote.quote
    qFooter.className = "blockquote-footer"
    qFooter.innerText = quote.author
    qBtn.className = "btn-success"
    qBtn.innerText = "Likes:"
    qBtn.dataset.quoteid = quote.id
    btnSpan.innerText = quote.likes.length
    qDelete.className = "btn-danger"
    qDelete.innerText = "Delete"
    qDelete.dataset.quoteid = quote.id

    qDelete.addEventListener("click", e => deleteQuote(e))
    qBtn.addEventListener("click", e => addLike(e))
    
    qBtn.appendChild(btnSpan)
    qBlock.append(qP, qFooter, lineBreak, qBtn, qDelete)
    qLi.append(qBlock)

    quotesList.appendChild(qLi)

}

function newQuote() {
    quoteForm.addEventListener("submit", e => {
        e.preventDefault()
        quote = e.target[0].value
        author = e.target[1].value
        createQuote(quote, author)
        e.target.reset()
    })
}

function addLike(e) {
    const quoteId = e.target.dataset.quoteid
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "quoteId": parseInt(quoteId),
            "createdAt": Date.now()
        })
    };
    return fetch("http://localhost:3000/likes", options)
        .then(res => res.json())
        .then(newObj => {
            getQuotes().then(quotes => {
                const likes = quotes.find(quote => quote.id == quoteId).likes.length;
                e.target.children[0].innerText = likes
            })
            // getQuotes().then(quotes => updateQuote(quotes.find(id => quoteId), likes))
        })
        
}

// function updateQuote(quote, key) {
    
// }

function deleteQuote(e) {
    const quoteId = e.target.dataset.quoteid
    const options = {
        method: "DELETE",
    };
    return fetch(quotesURL + `/${quoteId}`, options)
        .then(res => res.json())
        .then(e.target.parentElement.parentElement.remove())
}

function createQuote(newQuote, newAuthor) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quote: newQuote,
            author: newAuthor,
            likes: []
        })
    };
    return fetch(quotesURL, options)
        .then(res => res.json())
        .then(newObj => {
            renderQuotes(newObj)
        })
}

function main() {
    getQuotes().then(quotes => quotes.forEach(renderQuotes))
    newQuote()
}

main()
