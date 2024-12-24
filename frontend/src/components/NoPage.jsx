import {useNavigate} from "react-router-dom";


function NoPage() {
    const navigate = useNavigate();


    const onHomeBtnClick = () => {
        navigate('/');
    };

    return (
        <>
            <div style={{margin: "30px"}}>
                <button className='btn' style={{width: '120px', height: '40px'}} onClick={onHomeBtnClick}>&larr;Home</button>
                <h3 style={{color: 'red'}}>Oops, the page could not be found!</h3>
            </div>
        </>
    );
}

export default NoPage;
