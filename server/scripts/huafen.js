const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const striptags = require('striptags');

function curl(url) {
  const command = `curl '${url}'`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error !== null) {
        reject(error);
        return;
      }

      resolve(stdout);
    });
  });
}

async function getArticle(link) {
  console.log(link);
  const html = await curl(link);
  const title = html.match(/<h1 id="thread_subject">[\s\S]+?<\/h1>/)[1];
  const date = html.match(
    /<em id="\w+">发表于 [\s\S]*?(\d+-\d+-\d+ \d+:\d+:\d+)[\s\S]*?<\/em>/
  )[1];
  const firstPostTable = html.match(
    /<table id="pid\d+" class="plhin" summary="pid\d+" cellspacing="0" cellpadding="0">([\s\S]+?)<table cellspacing="0" cellpadding="0">([\s\S]+?)<\/table>/
  )[2];
  const text = striptags(firstPostTable).replace(/\s+/g, ' ');
  const videos = (firstPostTable.match(/<video([\s\S]+?)<\/video>/) || []).map(
    video => {
      return video.match(/<source src="([^"]+?)"/)[1];
    }
  );
  const images = (
    firstPostTable.match(
      /<img id="aimg_\d+" aid="\d+" src="[^"]+?" zoomfile="([^"]+?)"/g
    ) || []
  ).map(img => {
    return img.match(
      /<img id="aimg_\d+" aid="\d+" src="[^"]+?" zoomfile="([^"]+?)"/
    )[1];
  });

  return {
    title,
    date,
    text,
    videos,
    images,
  };
}

async function getLinksInPagination(searchId, page) {
  const body = await curl(
    `https://club.huawei.com/search.php?mod=forum&searchid=${searchId}&searchsubmit=yes&page=${page}`
  );
  const anchors = body.match(
    /<a\s+href="(thread-\d+-\d+-\d+\.html)"\s+target="_blank"\s*>/g
  );

  return anchors.map(anchor => {
    const href = anchor.match(
      /<a\s+href="(thread-\d+-\d+-\d+\.html)"\s+target="_blank"\s*>/
    )[1];

    return `https://club.huawei.com/${href}`;
  });
}

async function getArticleLinks() {
  const searchId = '142367873';

  const gettingLinkPromises = Array.from({ length: 13 }).map((_, index) =>
    getLinksInPagination(searchId, index + 1)
  );
  const pages = await Promise.all(gettingLinkPromises);

  return pages.flat();
}

async function getArticles() {
  const linksFile = path.resolve(__dirname, 'links.json');
  const links = await getArticleLinks();
  fs.writeFileSync(linksFile, JSON.stringify(links));
  // const cachedLinks = fs.readFileSync(linksFile, 'utf8');
  // const links = JSON.parse(cachedLinks);
  const articles = await Promise.all(links.map(getArticle));

  fs.writeFileSync(
    path.resolve(__dirname, 'huafen.json'),
    JSON.stringify(articles)
  );

  return articles;
}

getArticles().then(articles => {
  console.log('done', articles.length);
});
