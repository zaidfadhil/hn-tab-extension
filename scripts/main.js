
/* 
  TODO:

  - add fetch timeout 
  - move `JSON.parse(localStorage.getItem(cacheKey));` under try/catch
*/

window.addEventListener('load', async function () {
  const cacheKey = 'hntabCache';
  const cacheExpiration = 60 * 60 * 1000; // 1 hour in milliseconds
  const currentTime = new Date().getTime();
  const cachedData = JSON.parse(localStorage.getItem(cacheKey));

  if (cachedData && currentTime - cachedData.timestamp < cacheExpiration) {
    cachedData.items.forEach(item => {
      dispalyData(item)
    });
  } else {
    // yep try/catch all
    try {
      const listRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      var list = await listRes.json();
      list = list.slice(0, 30)

      const promises = list.map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(response => response.json()));
      await Promise.all(promises).then(items => {
        items.forEach(item => {
          dispalyData(item)
        });

        const cacheData = {
          timestamp: currentTime,
          items
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      })
    } catch (e) {
      console.error(e)
    }
  }
});

const dispalyData = (item) => {
  const newsList = document.getElementById('news-list');
  const listItem = document.createElement('li');
  listItem.innerHTML = `
    <a href="${item.url}" class="title">${item.title}</a>
    <div class="details">
      <span class="score">[${item.score}]</span>
      <span class="author">by ${item.by}</span>
    </div>
  `;
  newsList.appendChild(listItem);
}