<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>News App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #fafafa;
            padding: 20px;
        }
        #newsContainer {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
        }
        .newsCard {
            border: 1px solid #ccc;
            padding: 15px;
            width: 300px;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
            border-radius: 8px;
            background-color: white;
            transition: transform 0.2s ease;
        }
        .newsCard:hover {
            transform: scale(1.03);
        }
        .newsCard img {
            width: 100%;
            height: auto;
            border-radius: 8px;
        }
        #delayNotice {
            color: orange;
            margin-bottom: 15px;
            text-align: center;
        }
        input {
            display: block;
            margin: 0 auto 20px auto;
            padding: 10px;
            width: 80%;
            max-width: 400px;
            font-size: 16px;
        }
        h1 {
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>Top Headlines</h1>
    <input type="text" id="searchBox" placeholder="Search news..." />
    <div id="delayNotice"></div>
    <div id="newsContainer"></div>

    <script>
        const API_KEY = "f2d45eb3ea609fab80e78215cb498ecf";  
        const BASE_URL = "https://gnews.io/api/v4";
        const PROXY = "https://api.allorigins.win/get?url=";

        const newsContainer = document.getElementById("newsContainer");
        const searchBox = document.getElementById("searchBox");
        const delayNotice = document.getElementById("delayNotice");

        async function fetchNews(query = "") {
            try {
                let apiUrl = `${BASE_URL}/top-headlines?category=general&lang=en&apikey=${API_KEY}`;
                if (query) {
                    apiUrl = `${BASE_URL}/search?q=${encodeURIComponent(query)}&lang=en&apikey=${API_KEY}`;
                }

                const proxyUrl = PROXY + encodeURIComponent(apiUrl);
                const response = await fetch(proxyUrl);

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
                }

                const proxyData = await response.json();
                const data = JSON.parse(proxyData.contents); // Extract actual data

                console.log("API Response:", data);

                if (Array.isArray(data.articles) && data.articles.length > 0) {
                    displayNews(data.articles);
                    delayNotice.textContent = "";
                } else {
                    newsContainer.innerHTML = `<p>No news articles available at the moment.</p>`;
                }
            } catch (error) {
                console.error("Error fetching news:", error.message);
                delayNotice.textContent = "";
                newsContainer.innerHTML = `
                    <p style="color:red; text-align:center;">
                        ⚠️ Failed to load news: ${error.message}<br>
                        (Possible reasons: CORS issue, API limit reached, or invalid key.)
                    </p>`;
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

        // Debounced search
        let debounceTimeout;
        searchBox.addEventListener("input", (e) => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                fetchNews(e.target.value.trim());
            }, 500);
        });

        // Initial load
        fetchNews();
    </script>
</body>
</html>
