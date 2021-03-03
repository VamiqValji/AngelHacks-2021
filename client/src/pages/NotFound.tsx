import React from 'react';
import { Link } from "react-router-dom";


interface NotFoundProps {

}

export const NotFound: React.FC<NotFoundProps> = ({}) => {
        return (
            <>
            <div className="containerContainer">
                <div className="notFound">
                    <h1 style={{fontSize:55}} className="center">Page Not Found</h1>
                    <Link to="/"><button className="center">Take Me Home</button></Link>
                </div>
            </div>
            </>
        );
}

export default NotFound;