const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function curl(command) {
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

(async () => {
  const promises = Array.from({ length: 15 }).map(async (_, index) => {
    const rawData = await curl(`
      curl --header "Content-Type: application/json" \
      --request POST \
      --data '{"pid":"10086652154452","gbomCode":"","extraType":"0","pageSize":20,"pageNum":${index +
        1}}' \
      https://openapi.vmall.com/rms/comment/getCommentList.json?t=${Date.now()}
    `);
    const result = JSON.parse(rawData);
    return result.data.comments;
  });
  const commentsList = await Promise.all(promises);
  const comments = commentsList.flatMap(pageComments => {
    return pageComments.map(comment => comment.content);
  });
  const csv = comments.join('\n');
  const file = path.resolve(__dirname, 'vmall-comments.csv');
  fs.writeFileSync(file, csv);
})();
