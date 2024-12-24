// noinspection JSValidateTypes
// noinspection NpmUsedModulesInstalled

import proptypes from 'prop-types';
import {useNavigate} from "react-router-dom";


function Photo({url, onImageClick}) {
    const navigate = useNavigate();

    const onPhotoClick = () => {
        window.sessionStorage.setItem('homeScrollYPosition', JSON.stringify(window.scrollY));
        navigate('/photo-details');
        onImageClick();
    };

    return (
        <>
            <div className="photo-container" onClick={onPhotoClick}>
                <img  src={url} alt="photo" />
            </div>
        </>
    );
}

Photo.propTypes = {
    url: proptypes.string.isRequired,
    onImageClick: proptypes.func.isRequired,
};

export default Photo;
