
const API_KEY = "f2d45eb3ea609fab80e78215cb498ecf";  
const API_URL = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&apikey=${API_KEY}`;

const newsContainer = document.getElementById("newsContainer");
const searchBox = document.getElementById("searchBox");

async function fetchNews(query = "") {
    try {
        let url = API_URL;
        if (query) {
            url = `https://gnews.io/api/v4/search?q=${query}&lang=en&apikey=${API_KEY}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.articles || data.articles.length === 0) {
            throw new Error("No articles found.");
        }

        displayNews(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error.message);
        newsContainer.innerHTML = `<p style="color:red;">Failed to load news. Please check your API key or try again later.</p>`;
    }
}

function displayNews(articles) {
    newsContainer.innerHTML = "";

    articles.forEach(article => {
        const newsCard = document.createElement("div");
        newsCard.classList.add("newsCard");

        newsCard.innerHTML = `
            <img src="${article.image || 'https://via.placeholder.com/300'}" alt="News Image">
            <h3>${article.title}</h3>
            <p>${article.description || "No description available."}</p>
            <a href="${article.url}" target="_blank">Read More</a>
        `;

        newsContainer.appendChild(newsCard);
    });
}

// Search functionality
searchBox.addEventListener("input", (e) => {
    fetchNews(e.target.value);
});

// Load default news
fetchNews();



