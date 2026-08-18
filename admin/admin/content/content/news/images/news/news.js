const NEWS_URL =
    "https://api.github.com/repos/melinaamiri91/bikaran-website/contents/content/news";


async function loadNews() {

    const list =
        document.getElementById(
            "news-list"
        );


    if (!list) {
        return;
    }


    try {

        const response =
            await fetch(
                NEWS_URL
            );


        if (!response.ok) {
            throw new Error();
        }


        const files =
            await response.json();


        const newsFiles =
            files.filter(
                file =>
                    file.name.endsWith(
                        ".md"
                    )
            );


        newsFiles.sort(
            (a, b) =>
                b.name.localeCompare(
                    a.name
                )
        );


        list.innerHTML =
            "";


        for (
            const file of newsFiles
        ) {


            const response =
                await fetch(
                    file.download_url
                );


            const markdown =
                await response.text();


            const news =
                parseNews(
                    markdown
                );


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "news-card";


            card.innerHTML = `

                ${
                    news.image
                    ?
                    `
                    <img
                        src="${escapeHTML(news.image)}"
                        alt=""
                    >
                    `
                    :
                    ""
                }

                <div class="news-card-content">

                    <small>
                        ${escapeHTML(news.date)}
                    </small>

                    <h3>
                        ${escapeHTML(news.title)}
                    </h3>

                    <p>
                        ${escapeHTML(
                            news.text.substring(
                                0,
                                180
                            )
                        )}
                    </p>

                </div>

            `;


            list.appendChild(
                card
            );

        }


        if (
            newsFiles.length === 0
        ) {

            list.innerHTML = `
                <p>
                    هنوز خبری منتشر نشده است.
                </p>
            `;

        }


    } catch (error) {

        console.error(error);

        list.innerHTML = `
            <p>
                اخبار در حال بارگذاری است...
            </p>
        `;

    }

}



function parseNews(
    markdown
) {

    const parts =
        markdown.split(
            "---"
        );


    if (
        parts.length < 3
    ) {

        return {

            title:
                "خبر",

            date:
                "",

            image:
                "",

            text:
                markdown

        };

    }


    const front =
        parts[1];


    const text =
        parts
            .slice(2)
            .join("---")
            .trim();


    function get(
        key
    ) {

        const regex =
            new RegExp(
                "^" +
                key +
                ":\\s*[\"']?(.*?)[\"']?$",
                "m"
            );


        const result =
            front.match(
                regex
            );


        return result
            ?
            result[1]
            :
            "";

    }


    return {

        title:
            get("title"),

        date:
            get("date"),

        image:
            get("image"),

        text:
            text

    };

}



function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text || "";


    return div.innerHTML;

}


loadNews();
