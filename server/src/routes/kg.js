import fetch from 'node-fetch';

async function map(array, mapFn) {
  const promises = array.map(mapFn);
  const result = await Promise.all(promises);
  return result;
}

async function getRankList(mid) {
  // https://node.kg.qq.com/webapp/proxy?t_strKSongMid=002Rn3IH1mlv0E&t_page_num=100&t_page_index=0&ns=Rank_Protocol&cmd=rank.single&ns_inbuf=&nocache=1583166055850&g_tk_openkey=1543794411
  const url = `https://node.kg.qq.com/webapp/proxy?t_strKSongMid=${mid}&t_page_num=100&t_page_index=0&ns=Rank_Protocol&cmd=rank.single`;
  const response = await fetch(url);
  const body = await response.json();

  if (body.code) {
    throw new Error(`${body.code} ${body.msg}`);
  }

  return body.data['rank.single'].ranklist.map(
    ({ anthor_info: author, ugc_info: ugc }) => ({
      mid,
      ugcid: ugc.ugcid,
      ugcname: ugc.ugcname,
      score: ugc.score,
      hot_score: ugc.hot_score,
      score_rank: ugc.scoreRank,
      rank: ugc.iRank,
      userid: author.userid,
      nickname: author.nickname,
    })
  );
}

async function getDevice(ugcid) {
  // https://kg.qq.com/node/play?s=454827974_1577800956_166&g_f=accompanydetail
  const url = `https://kg.qq.com/node/play?s=${ugcid}&g_f=accompanydetail`;
  const response = await fetch(url);
  const body = await response.text();

  return body.match(/"tail_name":"([^"]*)"/)[1].trim();
}

async function getRankItemsByMid(mid) {
  const list = await getRankList(mid);
  const listWithDevice = await map(list, async item => {
    const device = await getDevice(item.ugcid);
    return { ...item, device };
  });
  return listWithDevice;
}

async function getRankListByMids(ctx) {
  // const { mids } = ctx.body;
  const mids = ['002Rn3IH1mlv0E'];
  const lists = await map(mids, getRankItemsByMid);
  const items = lists.flat();
  ctx.body = items;
}

export default getRankListByMids;
