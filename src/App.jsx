import React from 'react'
import SelectLocation from './components/SelectLocation';
import SearchBar from './components/SearchBar';

export default function App() {

    const [weather, setWeather] = React.useState({})
    const [locations, setLocations] = React.useState([])
    const [coordinates, setCoordinates] = React.useState({})
    const [search, setSearch] = React.useState("")
    const [searched, setSearched] = React.useState(false)

    React.useEffect(() => { 
        const controller = new AbortController();
        if (Object.keys(coordinates).length) {
            fetchData(
                `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current=temperature_2m,wind_speed_10m,rain`,
                setWeather
            )
        }
        return () => {
            controller.abort();
        }}
        , [coordinates]
    )

    React.useEffect(() => {
        const controller = new AbortController();
        if (searched) {
            fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${search}&language=en&format=json`
                )
                .then(res => res.json())
                .then(data => setLocations(data.results || [])
            )
        }
        return () => {
            controller.abort();
        }}, [searched]
    )

    function fetchData(url, setFunc) {
        fetch(url)
            .then(res => res.json())
            .then(data => setFunc(data))
    }
    
    const id = React.useId()

    function handleChoice(event) {
        const {value} = event.target
        if (!value=="") {
            setCoordinates(() => {
                const city = locations.find(city => city.id == value)
                if (city) {
                    const { latitude, longitude } = city;
                    return { latitude, longitude };
                } 
                else {
                  return null;
                }
            })
        }
        else {
            setWeather({})
        }     
    }

    function handleChange(event) {
        const {value} = event.target
        setSearch(value)
        if (setSearched)
            setSearched(false)
    }

    function handleSubmit(event) {
        event.preventDefault()
        if (search != "")
            setSearched(true)
        setWeather({})
    }

    console.log(locations)

    return (
        <div className="app">
            <header className="header">
                Weather App
            </header>
            <main>
                <SearchBar
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                />
                <SelectLocation
                    id={id}
                    locations={locations}
                    handleChoice={handleChoice}
                    value={locations}
                />
                <a className='attribution' href="https://open-meteo.com/">Weather data by Open-Meteo.com</a>
                <div>
                    <strong>{locations.length > 0 && "results" in locations ? locations.results[0].name : ""}</strong>
                </div>
                {
                    "current" in weather ?
                    <div className='data'>
                        <div className='temperature'>
                            <strong>Temp</strong> {weather.current.temperature_2m} °C
                        </div>
                        <div className='rain'>
                            <strong>Rain</strong> {" "}
                            {
                                weather.current.rain > 0 && weather.current.rain < 0.5
                                    ? "Slight rain"
                                    : weather.current.rain >= 0.5 && weather.current.rain < 4
                                    ? "Moderate rain"
                                    : weather.current.rain >= 4
                                    ? "Heavy rain"
                                    : "No rain"
                            }             
                        
                        </div>
                        <div className='wind'>
                            <strong>Wind</strong> {weather.current.wind_speed_10m} km/h
                        </div>
                    </div> : ""
                }
                
            </main>
        </div>
    )
}