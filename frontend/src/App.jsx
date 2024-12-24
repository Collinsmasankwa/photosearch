import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import PhotoDetails from "./components/PhotoDetails.jsx";
import {AppContext} from "./context/context.jsx";
import {useState} from "react";
import NoPage from "./components/NoPage.jsx";

function App() {
    const [searchResults, setSearchResults] = useState([]);
    const [totalPages, setTotalPages] = useState([]);
    const [currentPhotoDetails, setCurrentPhotoDetails] = useState({});
    const [currentQuery, setCurrentQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isRandomResult, setIsRandomResult] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorPresent, setErrorPresent] = useState(false);
    const [randomFirstDisplay, setRandomFirstDisplay] = useState(true);


    return (
        <>
            <AppContext.Provider value={{
                searchResults, setSearchResults, totalPages, setTotalPages, currentPhotoDetails, setCurrentPhotoDetails,
                currentQuery, setCurrentQuery, currentPage, setCurrentPage, isRandomResult, setIsRandomResult,
                loading, setLoading, errorMessage, setErrorMessage, errorPresent, setErrorPresent,
                randomFirstDisplay, setRandomFirstDisplay
            }}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/photo-details" element={<PhotoDetails />} />
                        <Route path='*' element={<NoPage />} />
                    </Routes>
                </BrowserRouter>
            </AppContext.Provider>
        </>
    );
}

export default App;
