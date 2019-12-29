/* eslint-disable no-undef */
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

import './App.css';

const get3Words = async (latitude, longitude) => {
    const currentLocation = await what3words.api.convertTo3wa({lat:latitude, lng:longitude})
    const southwest = await what3words.api.convertTo3wa(currentLocation.square.southwest);
    const northeast = await what3words.api.convertTo3wa(currentLocation.square.northeast);

    return {
        currentLocation,
        southwest,
        northeast
    };
}

const Square = styled.p`
    border: 10px dashed #817c7c;
    padding: 20% 0%;
`;

function App() {
    const [words, setWords] = useState('Getting Location...');

    useEffect(() => {
      if (!navigator.geolocation) {
        setWords('Geolocation is not supported by your browser');
      } else {
          navigator.geolocation.watchPosition(
              pos => {
                  setWords('Getting Location...');
                  get3Words(pos.coords.latitude, pos.coords.longitude)
                      .then(data => setWords(data.currentLocation.words))
                      .catch(() => setWords('Failed to get 3 words'));

              },
              () => setWords('Geolocation is needed to get your 3 words')
          );
      }
    }, [])

    return (
        <div>
            <Square>
              {words}
            </Square>
        </div>
    );
}

export default App;
