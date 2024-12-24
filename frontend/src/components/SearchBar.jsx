// noinspection JSUnresolvedReference

import {useEffect, useRef, useState} from "react";
import Loader from "./Loader.jsx";
import {useAppProvider} from "../context/context.jsx";
import axios from "axios";


function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const appProvider = useAppProvider();
    const debounceTimeout = useRef(null);
    const cancelToken = useRef(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorPresent, setErrorPresent] = useState(false);


    // hide error message after 4 minutes
    useEffect(() => {
        let timeout;

        if (errorPresent){
            timeout = setTimeout(()=>{
                setErrorPresent(false);
            }, 4000);
        }

        return ()=>clearTimeout(timeout);
    }, [errorPresent]);
    

    const onSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };
    

    const onSearchButtonClick = async () => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(async ()=>{
            appProvider.setCurrentQuery(searchQuery);

            if (cancelToken.current) {
                cancelToken.current.cancel();
            }

            appProvider.setCurrentPage(1);
            setLoading(true);
            cancelToken.current = axios.CancelToken.source();

            if (searchQuery.trim().length > 0) {

                try{
                    // check if current query and search query are the same, if not reset the page number to 1
                    // make req to server to get photos
                    setErrorPresent(false);

                    let res = await axios.post('https://photosearch-backend.onrender.com/get-photos', {
                        query: searchQuery.trim(),
                        page: appProvider.currentPage,
                    }, {
                        cancelToken: cancelToken.current.token,
                    });

                    if (res?.data?.response.results.length === 0){
                        setErrorPresent(true);
                        setErrorMessage("Sorry we couldn't find any results, try again with different keywords.");
                    } else {
                        setErrorPresent(false);
                    }

                    appProvider.setCurrentPage((pageNumber)=>pageNumber + 1);
                    // console.log(res?.data);


                    // res?.data?.response ==> will be a single object
                    appProvider.setSearchResults([res?.data?.response]);
                    appProvider.setTotalPages(res?.data?.response?.total_pages);
                    appProvider.setIsRandomResult(false);
                } catch (e) {
                    // console.log(e?.response?.data?.response);
                    
                    setErrorMessage(e?.response?.data?.response);
                    setErrorPresent(true);
                } finally {
                    setLoading(false);
                }
            } else {
                setErrorMessage('Please type something on the search input!');
                setErrorPresent(true);
                setLoading(false);
            }
        }, 300);
    };


    return (
        <>
            <div className="search-bar">
                <input type='search' placeholder='Search for an image here...' value={searchQuery || ''}
                       onChange={(event)=>onSearchInputChange(event)} />
                <input type='button' value='Search' onClick={onSearchButtonClick} />
            </div>

            {/* loader */}
            {loading && <Loader />}

            {/* notification area */}
            {
                errorPresent &&
                <div className='notification-div'>
                    <h3 style={{color: 'red'}}>{errorMessage}</h3>
                </div>
            }
        </>
    );
}


export default SearchBar;
