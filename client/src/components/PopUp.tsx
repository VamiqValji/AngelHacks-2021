import {
    Link
  } from "react-router-dom";


interface PopUpProps {
    message: string,
}

const PopUp: React.FC<PopUpProps> = ({message}) => {
        return (
            <>
                <div>{message}</div>
                <button><Link to="/join/:roomID">Home</Link></button>
            </>
        );
}

export default PopUp;