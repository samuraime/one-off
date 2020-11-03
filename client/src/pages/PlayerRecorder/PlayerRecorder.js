import React, { useState, useRef, useEffect, useMemo } from 'react';
import update from 'immutability-helper';
import './PlayerRecorder.css';

const allowCodes = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6'];

function App() {
  const videoRef = useRef(null);
  const [source, setSource] = useState(null);
  const [records, setRecords] = useState([[], [], [], [], [], []]);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;

    const keydownHandler = event => {
      const progressCodes = ['KeyD', 'KeyF'];
      if (progressCodes.includes(event.code)) {
        video.currentTime += ((event.code === 'KeyF' ? 1 : -1) * 1) / 24;
        return;
      }

      const codeIndex = allowCodes.findIndex(code => code === event.code);
      if (codeIndex === -1) {
        return;
      }

      const newRecords = event.shiftKey
        ? update(records, {
            [codeIndex]: {
              $splice: [[records[codeIndex].length - 1, 1]],
            },
          })
        : update(records, {
            [codeIndex]: {
              $push: [video.currentTime],
            },
          });
      setRecords(newRecords);
    };
    document.addEventListener('keydown', keydownHandler);

    return () => {
      document.removeEventListener('keydown', keydownHandler);
    };
  });

  useEffect(() => {
    const video = videoRef.current;
    const currentTimeHandler = () => {
      setCurrentTime(video.currentTime);
    };
    video.addEventListener('timeupdate', currentTimeHandler);

    return () => {
      video.removeEventListener('timeupdate', currentTimeHandler);
    };
  });

  const handleVideoChange = e => {
    if (!e.target.files[0]) {
      return;
    }
    URL.revokeObjectURL(source);
    const url = URL.createObjectURL(e.target.files[0]);
    setSource(url);
    videoRef.current.currentTime = 0;
  };

  const rows = useMemo(() => {
    const maxLength = records.reduce((length, list) => {
      return list.length > length ? list.length : length;
    }, 0);
    return Array.from({ length: maxLength });
  }, [records]);

  return (
    <div className="App">
      <video ref={videoRef} controls src={source} />
      {videoRef.current && !!currentTime && (
        <div className="video-current-time">Current: {currentTime}</div>
      )}
      <table className="record-panel">
        <thead>
          <tr>
            {records.map((_, index) => (
              <th key={index}>{index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((_, rowIndex) => (
            <tr key={rowIndex}>
              {allowCodes.map((_, columnIndex) => (
                <td key={columnIndex}>{records[columnIndex][rowIndex]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <footer>
        <input type="file" accept="video/*" onChange={handleVideoChange} />
        <span>F: 前进</span>
        <span>D: 后退</span>
        <span>1~6: 记录</span>
        <span>1~6 + Shift: 撤销记录</span>
      </footer>
    </div>
  );
}

export default App;
