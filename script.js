
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>News App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        #newsContainer {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }
        .newsCard {
            border: 1px solid #ccc;
            padding: 15px;
            width: 300px;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
        }
        .newsCard img {
            width: 100%;
            height: auto;
        }
        #delayNotice {
            color: orange;
            margin-bottom: 15px;
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

        const newsContainer = document.getElementById("newsContainer");
        const searchBox = document.getElementById("searchBox");
        const delayNotice = document.getElementById("delayNotice");

        async function fetchNews(query = "") {
            try {
                let url = `${BASE_URL}/top-headlines?category=general&lang=en&apikey=${API_KEY}`;
                if (query) {
                    url = `${BASE_URL}/search?q=${encodeURIComponent(query)}&lang=en&apikey=${API_KEY}`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                console.log("API Response:", data); // For debugging

                // Show delay notice if on free plan
                if (data.information?.realTimeArticles?.message) {
                    delayNotice.textContent = data.information.realTimeArticles.message;
                } else {
                    delayNotice.textContent = "";
                }

                if (Array.isArray(data.articles) && data.articles.length > 0) {
                    displayNews(data.articles);
                } else {
                    newsContainer.innerHTML = `<p>No news articles available at the moment.</p>`;
                }
            } catch (error) {
                console.error("Error fetching news:", error.message);
                delayNotice.textContent = "";
                newsContainer.innerHTML = `
                    <p style="color:red;">
                        Failed to load news: ${error.message}
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

        // Optional: debounce input to avoid too many requests
        let debounceTimeout;
        searchBox.addEventListener("input", (e) => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                fetchNews(e.target.value.trim());
            }, 500); // Delay search by 500ms
        });

        // Load default news on page load
        fetchNews();
    </script>
</body>
</html>


