/* eslint-disable */
// noinspection JSValidateTypes,NpmUsedModulesInstalled
import {useAppProvider} from "../context/context.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";


function PhotoDetails() {
    const appProvider = useAppProvider();
    const navigate = useNavigate();
    const [successfulDownloadMessage, setSuccessfulDownloadMessage] = useState('');


    const onBackBtnClick = () => {
        navigate('/');
    };

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

    // download the image
    const onDownloadBtnClick = async (event, imageUrl) => {
        event.preventDefault();

        try{
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = 'unsplash-image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            appProvider.setErrorPresent(false);
            setSuccessfulDownloadMessage('Downloaded the image successfully');

            // revoke the object url to free up memory
            URL.revokeObjectURL(url);
        } catch (error) {
            appProvider.setErrorPresent(true);
            appProvider.setErrorMessage('Error downloading the photo');
        }
    };


    // hide successful download message
    useEffect(() => {
        setTimeout(()=>{
            if (successfulDownloadMessage) {
                setSuccessfulDownloadMessage('');
            }
        }, 4000);
    }, [successfulDownloadMessage]);


    return (
        <>
            {/* download info area */}
            {appProvider.errorPresent && <h3 className='download-info-area' style={{color: 'red'}}>{appProvider.errorMessage}</h3>}
            {
                !appProvider.errorPresent && successfulDownloadMessage.trim().length > 0 &&
                <h3 className='download-info-area' style={{color: 'green'}}>{successfulDownloadMessage}</h3>
            }


            {/* back btn to home */}
            <button className='btn' style={{width: '120px', height: '40px'}} onClick={onBackBtnClick}>&larr;Home</button>

            <div className="photo-details-container">
                <div>
                    {/* image */}
                    <img src={appProvider.currentPhotoDetails.url} alt="photo"/>

                    {/* download image */}
                    <div style={{textAlign: 'right'}}>
                        <a href={`${appProvider.currentPhotoDetails.url}`}
                           onClick={(event)=>onDownloadBtnClick(event, appProvider.currentPhotoDetails.url)}>
                            <button className='btn' style={{width: '120px', height: '40px'}}>Download</button>
                        </a>
                    </div>

                    {/* created at */}
                    <h3>Created At: {appProvider.currentPhotoDetails.created_at}</h3>

                    {/* description */}
                    {appProvider.currentPhotoDetails.description &&
                        <h3>Description: {appProvider.currentPhotoDetails.description}</h3>
                    }
                </div>
            </div>
        </>
    );
}


export default PhotoDetails;
