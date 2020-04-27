const fs = require('fs');
const fetch = require('node-fetch');

async function getIMDBTechnicalSpecifications(id) {
  // https://www.imdb.com/title/tt0111161/
  const res = await fetch(`https://www.imdb.com/title/${id}/`);
  const body = await res.text();

  const country = body.match(
    /<h4 class="inline">Country:<\/h4>[\s\S]+?>([^<]+)/
  )[1];
  const matchedRatio = body.match(
    /<h4 class="inline">Aspect Ratio:<\/h4>([^<]+)/
  );
  const aspectRatio = matchedRatio ? matchedRatio[1].trim() : undefined;
  const aspectRatioValue = aspectRatio
    ? aspectRatio.split(':')[0].trim()
    : undefined;

  return { country, aspectRatio, aspectRatioValue };
}

async function getDoubanDetail(id) {
  // https://movie.douban.com/subject/1301753/
  const res = await fetch(`https://movie.douban.com/subject/${id}`);
  const body = await res.text();

  const jsonString = body.match(
    /<script type="application\/ld\+json">([\s\S]+?)<\/script>/
  )[1];
  // const { name, datePublished } = JSON.parse(jsonString);

  // https://www.imdb.com/title/tt0118799
  const imdbId = body.match(/https:\/\/www.imdb.com\/title\/(tt\d+)/)[1];
  const name = jsonString.match(/"name": "([^"]+)"/)[1];
  const matchedRelease = jsonString.match(/"datePublished": "([^"]+)"/);
  const release = matchedRelease ? matchedRelease[1] : undefined;

  return { name, release, imdbId };
}

async function getPage(start) {
  const res = await fetch(`https://movie.douban.com/top250?start=${start}`);
  const body = await res.text();

  const list = body.match(/<ol class="grid_view">([\s\S]+)<\/ol>/)[1];

  const parseItem = async string => {
    const rank = +string.match(/<em class="">(\d+)<\/em>/)[1];
    const id = string.match(/subject\/(\d+)/)[1];
    const { name, release, imdbId } = await getDoubanDetail(id);
    const {
      country,
      aspectRatio,
      aspectRatioValue,
    } = await getIMDBTechnicalSpecifications(imdbId);

    return {
      rank,
      id,
      name,
      release,
      imdbId,
      country,
      aspectRatio,
      aspectRatioValue,
    };
  };

  const items = await Promise.all(
    list
      .split(/<\/li>/)
      .filter(li => !!li.trim())
      .map(parseItem)
  );

  return items;
}

function escapeComma(string) {
  if (typeof string !== 'string' || !string.includes(',')) {
    return string;
  }

  return `"${string}"`;
}

function getCSV(array) {
  if (!array.length) {
    return '';
  }

  const header = `${Object.keys(array[0]).join(',')}\n`;
  const body = array
    .map(row =>
      Object.entries(row)
        .map(entry => escapeComma(entry[1]))
        .join(',')
    )
    .join('\n');

  return header + body;
}

async function getTop250() {
  const pages = await Promise.all(
    Array.from({ length: 10 }, (_, index) => getPage(index * 25))
  );

  const items = pages.flat();

  const csv = getCSV(items);

  fs.writeFileSync('/Users/samuraime/Downloads/douban-top-250.csv', csv);
}

getTop250();
