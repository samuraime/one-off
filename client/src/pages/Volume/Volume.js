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
      // red: #ff5555, #f05044, gray: #2b2b2b
      if (
        (data[offset] === 0xff &&
          data[offset + 1] === 0x55 &&
          data[offset + 2] === 0x55) ||
        (data[offset] === 0xf0 &&
          data[offset + 1] === 0x50 &&
          data[offset + 2] === 0x44) ||
        (data[offset] === 0x2b &&
          data[offset + 1] === 0x2b &&
          data[offset + 2] === 0x2b)
      ) {
        candidateRows.push(i);
      }
    }

    return candidateRows;
  }

  function getControls(candidates) {
    let start = null;
    let end = 0;
    const controls = [];
    const limit = 3;

    for (let i in candidates) {
      if (candidates[end + 1] !== candidates[i]) {
        if (start !== null) {
          const center = Math.floor((end + start) / 2);
          controls.push(candidates[center]);
          if (controls.length === limit) {
            break;
          }
        }

        start = i;
        end = i;
      } else {
        end = i;
      }
    }

    return controls;
  }

  function getValue(y) {
    const data = context.getImageData(0, y, width, 1).data;

    console.log(data.slice(345 * 4, 350 * 4));

    const candidates = [];
    for (let i = 0; i < width; i++) {
      const offset = i * 4;
      // red: #ff5555, #f05044, gray: #2b2b2b, bg: #131313
      if (
        (data[offset] === 0xff &&
          data[offset + 1] === 0x55 &&
          data[offset + 2] === 0x55) ||
        (data[offset] === 0xf0 &&
          data[offset + 1] === 0x50 &&
          data[offset + 2] === 0x44) ||
        (data[offset] === 0x2b &&
          data[offset + 1] === 0x2b &&
          data[offset + 2] === 0x2b)
      ) {
        candidates.push(i);
      }
    }

    // function isSameColor(leftIndex, rightIndex) {
    //   const l = leftIndex * 4;
    //   const r = rightIndex * 4;
    //   return (
    //     data[l] === data[r] &&
    //     data[l + 1] === data[r + 1] &&
    //     data[l + 2] === data[r + 2]
    //   );
    // }

    function getColorAt(index) {
      return data.slice(index * 4, (index + 1) * 4);
    }

    function length(a, b) {
      return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
    }

    function isNearLeft(middleColor, leftColor, rightColor) {
      return length(middleColor, leftColor) < length(middleColor, rightColor);
    }

    function getSeperatedPoint(left, right) {
      return Math.floor((left + right) / 2);
    }

    function getSeperatedPoints() {
      // |---------|-|-----|
      const firstIndex = candidates[0];
      const points = [firstIndex];
      // to start, |---------------
      for (let i = firstIndex - 1; i > 0; i--) {
        if (
          !isNearLeft(getColorAt(i), [0x13, 0x13, 0x13], getColorAt(firstIndex))
        ) {
          break;
        }
        points[0] = i;
      }
      // ---------|-|-----
      // to right
      const lastIndex = candidates[candidates.length - 1];
      // for (let i = candidates[0]; i < lastIndex; i++) {
      //   if (!isSameColor(i, i + 1)) {
      //     const point = getSeperatedPoint(i, i + 1);
      //     points.push(point);
      //   }
      // }
      for (let i = 0; i < candidates.length - 1; i++) {
        if (candidates[i] + 1 !== candidates[i + 1]) {
          const point = getSeperatedPoint(candidates[i], candidates[i + 1]);
          points.push(point);
        }
      }
      // to end, ---------------|
      points.push(lastIndex);
      for (let i = lastIndex + 1; i < width - 1; i++) {
        if (
          !isNearLeft(getColorAt(i), getColorAt(lastIndex), [0x13, 0x13, 0x13])
        ) {
          points[points.length - 1] = i - 1;
          break;
        }
      }

      console.log(candidates);
      console.log(points);

      return points;
    }

    const ps = getSeperatedPoints();
    const total = ps[3] - ps[0] - ps[2] + ps[1];
    const current = ps[1] - ps[0];

    return current / total;
  }

  const candidateRows = getCandidateRows();
  const controls = getControls(candidateRows);
  console.log(controls);
  const result = controls.map(getValue);
  console.log(result);
}

export default function VolumePage() {
  const handleChange = async event => {
    const files = Array.from(event.target.files);
    getVolumeValue(files[0]);
  };

  return <input type="file" multiple onChange={handleChange} />;
}
