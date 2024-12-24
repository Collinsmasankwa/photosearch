/* eslint-disable */
// noinspection JSValidateTypes,JSUnresolvedReference,JSDeprecatedSymbols

import logo from '/logo.png';
import SearchBar from "./SearchBar.jsx";
import Photo from "./Photo.jsx";
import {useCallback, useEffect, useRef} from "react";
import {useAppProvider} from "../context/context.jsx";
import axios from "axios";
import Loader from "./Loader.jsx";

function Home() {
    const appProvider = useAppProvider();
    const debounceTimeout = useRef(null);
    const cancelToken = useRef(null);


    // hide error message after 4 minutes
    useEffect(() => {
        let timeout;

        if (appProvider.errorPresent){
            timeout = setTimeout(()=>{
                appProvider.setErrorPresent(false);
            }, 4000);
        }

        return ()=>clearTimeout(timeout);
    }, [appProvider.errorPresent]);

    
    const loadRandomImages = useCallback(async ()=>{
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(async ()=>{
            try{

                if (cancelToken.current) {
                    cancelToken.current.cancel();
                }

                cancelToken.current = axios.CancelToken.source();

                // make req to server to get photos
                if (!appProvider.randomFirstDisplay){
                    appProvider.setLoading(true);
                }

                appProvider.setErrorPresent(false);

                let res = await axios.post('http://localhost:3000/get-random-photos', null, {
                    cancelToken: cancelToken.current.token,
                });

                appProvider.setErrorPresent(false);

                // console.log(res?.data.response);

                // res?.data?.response ==> will be an array of objects
                appProvider.setSearchResults(prev=>[...prev, ...res.data.response]);
                appProvider.setIsRandomResult(true);
                appProvider.setRandomFirstDisplay(false);
            } catch (e) {
                console.log(e?.response?.data?.response);

                appProvider.setErrorMessage(e?.response?.data?.response);
                appProvider.setErrorPresent(true);
            } finally {
                appProvider.setLoading(false);
            }
        }, 300);
    }, []);
    
    
    // on load of page, display random photos
    useEffect(() => {
        (async ()=>{
            if (appProvider.isRandomResult && appProvider.randomFirstDisplay){
                appProvider.setSearchResults([]);
                await loadRandomImages();   
            }
        })();
    }, [appProvider.setSearchResults, loadRandomImages, appProvider.isRandomResult, appProvider.randomFirstDisplay]);


    // scroll to the last scroll pos
    useEffect(() => {
        let homeScrollYPosition = JSON.parse(window.sessionStorage.getItem("homeScrollYPosition"));

        if (homeScrollYPosition){
            window.scroll(0, homeScrollYPosition);
        }
    }, []);
    
    
    // onImageClick, set content of the detailed image to see
    const onImageClick = (created_at, description, url)=>{
        appProvider.setCurrentPhotoDetails({
            created_at, description, url
        });
    };
    
    
    // loadMoreRandomImages
    const loadMoreRandomImages = async ()=>{
        await loadRandomImages();
    };
    
    
    // load more search images
    const loadMoreSearchImages = async () => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(async ()=>{
            appProvider.setCurrentQuery(appProvider.currentQuery);

            if (cancelToken.current) {
                cancelToken.current.cancel();
            }

            appProvider.setLoading(true);
            cancelToken.current = axios.CancelToken.source();

            if (appProvider.currentQuery.trim().length > 0) {
                try{
                    // make req to server to get photos
                    appProvider.setErrorPresent(false);

                    let res = await axios.post('http://localhost:3000/get-photos', {
                        query: appProvider.currentQuery.trim(),
                        page: appProvider.currentPage,
                    }, {
                        cancelToken: cancelToken.current.token,
                    });

                    appProvider.setErrorPresent(false);
                    appProvider.setCurrentPage((pageNumber)=>pageNumber + 1);
                    
                    
                    console.log(res?.data);
                    
                    // res?.data?.response ==> will be a single object
                    appProvider.setSearchResults((prevResults)=>[...prevResults, res?.data?.response]);

                    appProvider.setIsRandomResult(false);
                } catch (e) {
                    console.log(e?.response?.data?.response);
                    appProvider.setErrorMessage(e?.response?.data?.response);
                    appProvider.setErrorPresent(true);
                } finally {
                    appProvider.setLoading(false);
                }
            } else {
                appProvider.setErrorMessage('Please type something on the search input!');
                appProvider.setErrorPresent(true);
            }
        }, 300);
    };


    return (
        <>
            {/* app logo */}
            <div className='home-header'>
                <img src={logo} alt='logo'/>
                <h3>Photosearch Engine</h3>
            </div>

            {/* short intro */}
            <h3 style={{textAlign: 'center'}}>
                Welcome to PhotoSearch engine, to get started, type in what you&apos;d like to view as an image for!
            </h3>

            {/* search bar */}
            <SearchBar/>

            {/* content area */}
            <div className='main-content-div'>
                {/* search results */}
                {
                    !appProvider.isRandomResult &&
                    appProvider.searchResults?.map(results => results.results?.map((result, index) => {
                        return <Photo url={result?.urls?.small} key={index}
                                      onImageClick={() => onImageClick(result?.created_at, result.description, result?.urls?.small)}/>
                    }))
                }

                {/* random results */}
                {
                    appProvider.isRandomResult &&
                    appProvider.searchResults?.map((result, index) => {
                        return <Photo url={result.urls?.small} key={index}
                                      onImageClick={() => onImageClick(result?.created_at, result?.description, result?.urls?.small)}/>
                    })
                }
            </div>

            {/* load more photos for searched images */}
            {
                appProvider.currentPage < appProvider.totalPages + 1 && !appProvider.isRandomResult &&
                <div style={{textAlign: 'center'}}>
                    <button className='btn' onClick={loadMoreSearchImages}>Load More Images</button>
                </div>
            }

            {/* load more photos for random images */}
            {
                appProvider.isRandomResult && appProvider.searchResults.length > 0 &&
                <div style={{textAlign: 'center'}}>
                    {/* loader */}
                    {appProvider.loading && <Loader />}

                    {/* error messages for getting new random images */}
                    {
                        appProvider.errorPresent &&
                        <div className='notification-div'>
                            <h3 style={{color: 'red'}}>{appProvider.errorMessage}</h3>
                        </div>
                    }
                    <button className='btn' onClick={loadMoreRandomImages}>Load More Random Images</button>
                </div>
            }

            {/* app copyright   */}
            <br/>
            <div style={{textAlign: 'center', width: 'fit-content', margin: 'auto'}}>
                <h3 className='copyrights'>&copy;Photosearch Engine {new Date().getFullYear()}</h3>
                <h3 className='copyrights'>&copy;Collins Masankwa {new Date().getFullYear()}</h3>
            </div>
        </>
    );
}

export default Home;
