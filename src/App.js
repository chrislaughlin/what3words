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

const Geo = styled.p`
    font-size: 2vmin;
    color: gray;
    display: flex;
    flex-direction: column;
    align-content: center;
`;

const WhatLink = styled.a`
    font-size: 2vmin;
    color: gray;
    color: #137dc1;
    text-decoration: none;
    margin-top: 20px;
`;

function App() {
    const [words, setWords] = useState('Getting Location...');
    const [geo, setGeo] = useState(null);

    useEffect(() => {
      if (!navigator.geolocation) {
        setWords('Geolocation is not supported by your browser');
      } else {
          navigator.geolocation.watchPosition(
              pos => {
                  setWords('Getting Location...');
                  get3Words(pos.coords.latitude, pos.coords.longitude)
                      .then(data => {
                          setWords(data.currentLocation.words)
                          setGeo({latitude: pos.coords.latitude, longitude: pos.coords.longitude})
                      })
                      .catch(() => {
                          setWords('Failed to get 3 words')
                          setGeo(null)
                      });

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
            <Geo>
                {
                    geo && <span>{`latitude: ${geo.latitude} | longitude: ${geo.longitude}`}</span>
                }
                <WhatLink
                    href="https://what3words.com/"
                    target="_blank"
                >
                    What 3 Words
                </WhatLink>
            </Geo>

        </div>
    );
}

export default App;
