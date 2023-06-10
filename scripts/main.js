
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
  // using Elements instead of innerHTML to pass firefox plugin checks

  const newsList = document.getElementById('news-list');
  const listItem = document.createElement('li');
  
  const link = document.createElement('a');
  link.href = item.url;
  link.classList.add('title');
  link.textContent = item.title;
  
  const details = document.createElement('div');
  details.classList.add('details');
  
  const scoreSpan = document.createElement('span');
  scoreSpan.classList.add('score');
  scoreSpan.textContent = `[${item.score}]`;
  
  const authorSpan = document.createElement('span');
  authorSpan.classList.add('author');
  authorSpan.textContent = `by ${item.by}`;
  
  details.appendChild(scoreSpan);
  details.appendChild(authorSpan);
  
  listItem.appendChild(link);
  listItem.appendChild(details);
  
  newsList.appendChild(listItem);
}