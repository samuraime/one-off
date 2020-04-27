import React from 'react';

function getImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = error => {
      reject(error);
    };
  });
}

function getDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = error => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}

async function getVolumeValue(file) {
  const url = await getDataURL(file);
  const image = await getImage(url);
  const { naturalWidth: width, naturalHeight: height } = image;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);

  function getCandidateRows() {
    const midX = Math.floor(width / 2);
    const data = context.getImageData(midX, 0, 1, height).data;
    const candidateRows = [];
    for (let i = 0; i < height; i++) {
      const offset = i * 4;
      // red: #ff5555, gray: #2b2b2b
      if (
        (data[offset] === 0xff &&
          data[offset + 1] === 0x55 &&
          data[offset + 2] === 0x55) ||
        (data[offset] === 0x2b &&
          data[offset + 1] === 0x2b &&
          data[offset + 2] === 0x2b)
      ) {
        candidateRows.push(i);
      }
    }

    return candidateRows;
  }

  function getRows(candidates) {
    let start = null;
    let end = 0;
    const rows = [];
    const limit = 2;

    for (let i in candidates) {
      if (candidates[end + 1] !== candidates[i]) {
        if (start !== null) {
          const center = Math.floor((end + start) / 2);
          rows.push(candidates[center]);
          if (rows.length === limit) {
            break;
          }
        }

        start = i;
        end = i;
      } else {
        end = i;
      }
    }

    return rows;
  }

  function getRowPercentage(row) {
    const data = context.getImageData(0, row, width, 1).data;

    const candidateRows = [];
    for (let i = 0; i < height; i++) {
      const offset = i * 4;
      // red: #ff5555, gray: #2b2b2b
      if (
        (data[offset] === 0xff &&
          data[offset + 1] === 0x55 &&
          data[offset + 2] === 0x55) ||
        (data[offset] === 0x2b &&
          data[offset + 1] === 0x2b &&
          data[offset + 2] === 0x2b)
      ) {
        candidateRows.push(i);
      }
    }

    return candidateRows;
    // return
  }

  const candidateRows = getCandidateRows();
  const rows = getRows(candidateRows);
  const result = rows.map(getRowPercentage);
  console.log(result);
}

export default function VolumePage() {
  const handleChange = async event => {
    const files = Array.from(event.target.files);
    getVolumeValue(files[0]);
  };

  return <input type="file" multiple onChange={handleChange} />;
}
