import React, { useState, useEffect } from 'react';
import ExploreCard from './ExploreCard';
import axios from 'axios';
import { divIcon } from 'leaflet';
import opencage from 'opencage-api-client';

function ExplorePage() {

    const [cardsData, setCardsData] = useState([]);
    const [category, setCategory] = useState('All');
    const [searchText, setSearchText] = useState('');

    const [searchAddress, setSearchAddress] = useState('');
    const [newAdddressGPSCoordinates, setNewAdddressGPSCoordinates] = useState({ lat: 0, lng: 0 })
    const [listAddresses, setListAddresses] = useState([])
    const [showAddressButton, setShowAddressButton] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState('')

    const [distanceRange, setDistanceRange] = useState(10)

    const [selectionStartDate, setSelectionStartDate] = useState('');
    const [selectionEndDate, setSelectionEndDate] = useState('');

    // Address search and map positioning
    useEffect(() => {
        const getCoordinates = async () => {
            try {
                const gpsCoordinates = await opencage.geocode({ q: searchAddress, key: 'dbcf492b8db545538b8b5d9acbeb0313' });
                console.log(gpsCoordinates.results);
                setListAddresses(gpsCoordinates.results)
            } catch (error) {
                console.error(error);
            }
        };
        getCoordinates()
    }, [searchAddress])

    useEffect(() => {
        if (!!searchAddress.length) {
            setShowAddressButton(true)
        } else {
            setShowAddressButton(false)
            setNewAdddressGPSCoordinates({ lat: 0, lng: 0 })
        }
    }, [searchAddress])

    useEffect(() => {
        const getAllCards = async () => {
            try {
                const allCardsData = await axios.get('http://localhost:7777/explore');
                setCardsData(allCardsData.data);
            } catch (error) {
                console.error(error);
            }
        }
        getAllCards()
    }, []);

    useEffect(() => {
        console.log(category);

        const getCategory = async () => {
            let categoryData = false
            try {
                if (category == 'All') {
                    categoryData = await axios.get('http://localhost:7777/explore');
                } else {
                    categoryData = await axios.get(`http://localhost:7777/category/?category=${category}`);
                }
                setCardsData(categoryData.data);
            } catch (error) {
                console.error(error);
            }
        }

        if (!!category) {
            getCategory()
            setCategory('')
        }
    }, [category]);

    useEffect(() => {
        const getSearch = async () => {
            try {
                const searchData = await axios.get(`http://localhost:7777/search/?searchtext=${searchText}&&distanceRange=${distanceRange}&&selectionStartDate=${selectionStartDate}&&selectionEndDate=${selectionEndDate}&&gpsLat=${newAdddressGPSCoordinates.lat}&&gpsLng=${newAdddressGPSCoordinates.lng}`);
                setCardsData(searchData.data);
                console.log(searchData.data);
            } catch (error) {
                console.error(error);
            }
        }
        getSearch()
    }, [searchText, distanceRange, selectionStartDate, selectionEndDate, searchAddress, newAdddressGPSCoordinates]);


    const [orderByTitleState, setOrderByTitleState] = useState(false)
    useEffect(() => {
        const orderByTitle = () => {
            const newCardsData = [...cardsData];
            console.log(newCardsData)
            const sortArray = (first, second) => {
                newCardsData.sort(function (a, b) {
                    var nameA = a.event_title.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.event_title.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return first;
                    }
                    if (nameA > nameB) {
                        return second;
                    }
                    return 0;
                });
            }
            if (orderByTitleState) {
                sortArray(-1, 1)
            } else if (!orderByTitleState) {
                sortArray(1, -1)
            }
            console.log(newCardsData)
            setCardsData(newCardsData);
            console.log(cardsData)
        }
        orderByTitle()
    }, [orderByTitleState])



    const [orderByDateState, setOrderByDateState] = useState(false)
    useEffect(() => {
        const orderByDate = () => {
            const newCardsData = [...cardsData];
            console.log(newCardsData)
            const sortArray = (first, second) => {
                newCardsData.sort(function (a, b) {
                    var nameA = a.event_start_date.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.event_start_date.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return first;
                    }
                    if (nameA > nameB) {
                        return second;
                    }
                    return 0;
                });
            }
            if (orderByDateState) {
                sortArray(-1, 1)
            } else if (!orderByDateState) {
                sortArray(1, -1)
            }
            console.log(newCardsData)
            setCardsData(newCardsData)
            console.log(cardsData)
        }
        orderByDate()
    }, [orderByDateState])

    const [orderByPriceState, setOrderByPriceState] = useState(false)
    useEffect(() => {
        const orderByPrice = () => {
            const newCardsData = [...cardsData];
            console.log(newCardsData)
            if (orderByPriceState) {
                newCardsData.sort(function (a, b) {
                    return a.event_price - b.event_price
                });
            } else if (!orderByPriceState) {

                newCardsData.sort(function (a, b) {
                    return b.event_price - a.event_price
                });
            }
            console.log(newCardsData)
            setCardsData(newCardsData);
            console.log(cardsData)
        }
        orderByPrice()
    }, [orderByPriceState])


    return (
        <div>
            <div className="container">
                <form className="content-center pl-8 ml-12 pt-6" value={searchText} onChange={(e) => { setSearchText(e.target.value) }} role="search">
                    <input className="bg-gray-100 rounded-md px-4 py-2 container focus:ring-purple-600 outline-none tracking-tighter" /* id="search" type="search" */ placeholder="find out what's popping" />
                    <button className="hidden absolute inset-0 rounded-md" type="submit">Go</button>
                </form>
            </div>

            <div className="container">
                <form className="content-left pl-8 ml-12 pt-6" value={selectionStartDate} onChange={(e) => { setSelectionStartDate(e.target.value) }} role="search">
                    <input className="bg-gray-100 rounded-md px-4 py-2 container focus:ring-purple-600 outline-none tracking-tighter" type="datetime-local" placeholder="Start" />
                    <button className="hidden absolute inset-0 rounded-md" type="submit">Go</button>
                </form>
            </div>

            <div className="container">
                <form className="content-left pl-8 ml-12 pt-6" value={selectionEndDate} onChange={(e) => { setSelectionEndDate(e.target.value) }} role="search">
                    <input className="bg-gray-100 rounded-md px-4 py-2 container focus:ring-purple-600 outline-none tracking-tighter" type="datetime-local" placeholder="Final" />
                    <button className="hidden absolute inset-0 rounded-md" type="submit">Go</button>
                </form>
            </div>

            <div>
                <form className="content-left pl-8 ml-12 pt-6">
                    <input value={searchAddress}
                        onChange={(e) => { setSearchAddress(e.target.value) }}
                        className="bg-gray-100 rounded-md px-4 py-2 container focus:ring-purple-600 outline-none tracking-tighter"
                        placeholder="address, city, country"
                        type="text"
                    />
                    <button className="hidden absolute inset-0 rounded-md" type="submit">Go</button>
                </form>

                <div class="origin-top-right absolute left-0 mt-2 w-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {
                            listAddresses.map((address) => {
                                return (
                                    <form>
                                        <button
                                            onClick={() => {
                                                setSearchAddress(address.formatted)
                                                setNewAdddressGPSCoordinates(address.geometry);
                                                setShowAddressButton(false)
                                                setSelectedAddress(address.formatted)
                                            }}
                                            type='button'
                                            className={
                                                showAddressButton && !!searchAddress.length && selectedAddress != searchAddress
                                                    ?
                                                    "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                                                    :
                                                    "hidden block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                                            }
                                        >
                                            {address.formatted}
                                        </button>
                                    </form>
                                )
                            })
                        }
                    </div>
                </div>
            </div>


            <div className="container">
                <form className="content-left pl-8 ml-12 pt-6" >
                    <div>Ditance from address</div>
                    <input value={distanceRange} onChange={(e) => { setDistanceRange(e.target.value) }} type="range" min="2" max="20" step="2" />
                    <div>{distanceRange} Km</div>
                </form>
            </div>

            <div class="container hidden md:block md:ml-12 md:pr-12 md:space-x-8 py-6 text-center tracking-tighter" >
                <button onClick={() => setCategory('All')} class="focus:outline-none text-md font-light text-grey-500 hover:text-gray-400" >All</button>{''}
                <button onClick={() => setCategory('Yoga')} class="focus:outline-none text-md font-light text-grey-500 hover:text-gray-400" >Yoga</button>{''}
                <button onClick={() => setCategory('Festival')} class="focus:outline-none text-md font-light text-grey-500 hover:text-gray-400" >Festival</button>{''}
                <button onClick={() => setCategory('Literature')} class="focus:outline-none text-md font-light text-grey-500 hover:text-gray-400" >Literature</button>{''}
                <button onClick={() => setCategory('Restaurant')} class="focus:outline-none text-md font-light text-grey-500 hover:text-gray-400" >Restaurant</button>
            </div>

            <div class="container hidden md:block md:ml-12 md:pr-12 md:space-x-8 py-6 text-center tracking-tighter" >
                <button onClick={() => { setOrderByTitleState(!orderByTitleState) }} class="focus:outline-none text-md font-light text-grey-500 hover:text-gray-400" >Title</button>{''}
                <button onClick={() => { setOrderByDateState(!orderByDateState) }} class="focus:outline-none text-md font-light text-grey-500 hover:text-gray-400" >Date</button>{''}
                <button onClick={() => { setOrderByPriceState(!orderByPriceState) }} class="focus:outline-none text-md font-light text-grey-500 hover:text-gray-400" >Price</button>{''}
            </div>

            < div className="grid grid-cols-3 gap-2" >
                {
                    cardsData.map((card) => {
                        console.log(card);
                        console.log(category)
                        return < ExploreCard
                            event_id={card.event_id}
                            event_category={card.event_category}
                            event_title={card.event_title}
                            event_description={card.event_description}
                            event_location={card.event_location}
                            event_country={card.event_country}
                            event_city={card.event_city}
                            event_postalcode={card.event_postalcode}
                            event_address={card.event_address}
                            event_host_phone={card.event_host_phone}
                            event_host_email={card.event_host_email}
                            event_price={card.event_price}
                            event_start_date={card.event_start_date}
                            event_end_date={card.event_end_date}
                            open_spots={card.open_spots}
                        />
                    })
                }
            </div >
        </div >
    )
}

export default ExplorePage