import { Wheel } from 'react-custom-roulette'
import { useEffect, useState } from 'react'
import './App.css';
import logo from './logo.svg';
import loader from './loader';

// GitLab API base URL
const baseURL = 'https://gitlab.com/api/v4';

// truncate off strings that are too long
const truncate = (str, n) => (str.length > n) ? `${str.substr(0, n - 1)}...` : str;

/*
 * This is the main application.
 * It loads open merge requests and puts them on the spinning
 * wheel. A random merge request is the "prize" that will
 * be selected.
 */
function App() {
  document.title = 'Code Roulette';

  const [data, setData] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    if (data.length > 0) {
      setPrizeNumber(Math.floor(Math.random() * data.length));
      setMustSpin(true);
    }
  }

  useEffect(() => {
    loader(baseURL).then(token => {
      fetch(`${baseURL}/merge_requests?state=opened&scope=all&per_page=18`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(response => response.json())
        .then(raw => {
          if (Array.isArray(raw) && raw.length > 0) {
            raw.forEach(entry => entry.option = truncate(entry.title, 16));
            setData(raw);
          } else {
            setData([
              { option: 'unavailable' },
              { option: 'unavailable' },
            ])
          }
        })
        .catch(err => console.log('oops', err));
    });
  }, []);

  return (
    <div className="App">
      <header>
        <img src={logo} alt="Code Roulette" />
      </header>
      <div>Click the wheel to spin it. It will take you to a random open merge request. Happy commenting!</div>
      <div className={data.length > 0 ? 'show' : 'hide'}>
        <button onClick={handleSpinClick}>
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            textDistance={50}
            onStopSpinning={() => {
              if (data[prizeNumber].web_url) {
                document.location.href = `${data[prizeNumber].web_url}/diffs`;
              }
            }}
            data={data}
          />
        </button>
      </div>
    </div>
  );
}

export default App;
