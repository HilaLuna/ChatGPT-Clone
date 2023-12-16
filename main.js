const chatInput = document.querySelector("#chat-input")
const sendButton = document.querySelector("#send-btn")
const chatContainer = document.querySelector(".chat-container")
const themeButton = document.querySelector("#theme-btn")
const deleteButton = document.querySelector("#delete-btn")

console.log(deleteButton)
//console.log(chatContainer)
//console.log(sendButton)
//console.log(chatInput)
let userText = null //Enter a prompt here kısmının içindeki veriyi alabilmemiz için globalde bir let tanımladık. 

const API_KEY = "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"
const initialHeight = chatInput.scrollHeight

// sayfa yüklendiğinde yerel depodan (localStorage) veri yükler
const loadDataFromLocalStorage = () =>{
    //tema rengini kontrol eder ve geçerli temayı uygular
const themeColor = localStorage.getItem("theme-color")
document.body.classList.toggle("light-mode",themeColor==="light_mode")
    // tema rengini yerel depoda günceller
    localStorage.setItem("theme-color", themeButton.innerText)
    themeButton.innerText = document.body.classList.contains("light-mode")
        ? "dark_mode" //şartlı renderlama
        : "light_mode"
        const defaultText = `
            <div class="default-text">
                <h1>ChatGPT Clone</h1>
            </div>
        `;
    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText
    //sayfayı sohbetin en altına kaydırır
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
}
loadDataFromLocalStorage() //bu fonksiyonu tanımladığımız için chatgpt clone'da arama yapıp sayfayı yenilediğinde yazdıkların kaybolmuyor.

const createElement = (html, className) =>{
    //yeni div oluşturma ve belirtilen chat sınıfını ekleme
    //div'in html içeriğini ayarlama
    const chatDiv = document.createElement("div")
    chatDiv.classList.add("chat", className)
    chatDiv.innerHTML =html
    return chatDiv //return fonksiyonları durdurmamıza veya dışarı veri aktarmamıza yarar.
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL="https://api.openai.com/v1/completions"
    const pElement = document.createElement("p")

// API talebi için özelliklerini ve verileri tanımlama
    const requestOptions = {
        method: "POST",
        headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null,
        }),
    }

    try {
       const response = await (await fetch(API_URL,requestOptions)).json() /*await'in içindeki
       fetch ile attığımız isteği beklememiz gerekiyor, daha sonra gelecek olan cevabı
       json yapısına yani obje yapısına çevirip console'a yazdık. */
       console.log(response)
      pElement.textContent = response.choices[0].text.trim()
    } catch (error) {
        console.log(error)
        pElement.textContent = "Oops"
    }
    incomingChatDiv.querySelector(".typing-animation").remove()
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement)
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
    localStorage.setItem("all-chats", chatContainer.innerHTML)
}

const showTypingAnimation = () => {
    const html = `
    <div class="chat-content">
                <div class="chat-details">
                    <img src="images/chatbot.jpg" alt="chat-images">
                    <div class="typing-animation">
                        <div class="typing-dot" style="--delay:0.2s"></div>
                        <div class="typing-dot" style="--delay:0.3s"></div>
                        <div class="typing-dot" style="--delay:0.4s"></div>
                    </div>
                </div>
                <span class="material-symbols-outlined">content_copy
                </span>
            </div>`
    const incomingChatDiv = createElement(html, "incoming")
    chatContainer.appendChild(incomingChatDiv)
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
    getChatResponse(incomingChatDiv)
}

const handleOutGoingChat =() =>{ //bu fonksiyonu burada tanımlıyoruz.arrow function tanımladık.
    userText = chatInput.value.trim() //bu kısım hata veriyor. //Enter a prompt here kısmının yazacağın başındaki ve sonundaki fazladan boşlukları kesiyor.
    if (!userText) return //ünlem şunu yapmakla aynı şey userText == null - JS'te ünlem varsa tersini algılıyor.
    /*Yani userText eğer boşsa geri döndür, fonksiyonları durdur anlamına geliyor.*/
    const html = `<div class="chat-content">
    <div class="chat-details">
        <img src="images/user.jpg" alt="user-images">
        <p>
            ${userText}
        </p>
    </div>
</div>`

const outgoingChatDiv = createElement(html, "outgoing") //JS'te div createElement'le yapılıyor
outgoingChatDiv.querySelector("p").textContent = userText
document.querySelector(".default-text")?.remove()
chatContainer.appendChild(outgoingChatDiv)
chatContainer.scrollTo(0, chatContainer.scrollHeight)
setTimeout(showTypingAnimation, 500)
}

themeButton.addEventListener("click", () =>{
    document.body.classList.toggle("light-mode")
    localStorage.setItem("theme-color", themeButton.innerText)
    themeButton.innerText = document.body.classList.contains("light-mode") 
    ? "dark_mode" //soru işareti eğer içeriyorsa anlamına geliyor
    : "light_mode" // eğer içermiyorsa
})

deleteButton.addEventListener("click",()=>{
    if(confirm("Tüm sohbeti silmek istediğinizden emin misiniz?")){
     localStorage.removeItem("all-chats")
     loadDataFromLocalStorage()
    }
})

chatInput.addEventListener("input",()=>{
    chatInput.style.height = `${initialHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px` //en altta yazı yazdığımız kutucuğu scroll yapınca büyüttük.
})
chatInput.addEventListener("keydown",(e) =>{ //keydown bir tuşa basıp onu izlememizi sağlar
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault()
        handleOutGoingChat()
    }
})

sendButton.addEventListener("click", handleOutGoingChat) //buna tıklandığında bir fonksiyon çalıştırsın.
/*burada sendbutton'a bir olay izleyicisi ekledik, buna tıklandığında
handleoutgoingchat fonksiyonu çalışsın. */