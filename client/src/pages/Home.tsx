// import { watch } from 'fs';
import React from 'react'
import img  from '../imgs/logo.svg'
import { Link } from "react-router-dom";

interface HomeProps {

}

const Home: React.FC<HomeProps> = ({}) => {
    return (
        <>
            <div className="containerContainer">
                <div className="homeContainer">
                <div className="container">
                    <h1 className="center watchContainer"><span className="watch">watch</span>Socket</h1>
                    <img src={img} alt="logo"  className="center"
                    style = { {margin: "auto", width: "500px", height: "482px"}}
                    />
                    <br/>
                    <br/>
                    <h3><span className="watch">watch</span>Socket <span className="light"> enables you to watch videos with buddies in a </span> <b>synchronous</b> <span className="light">manner!</span></h3>
                    <Link to="/create"><button className="center">Get Started</button></Link>
                </div>
                </div>
            </div>
        </>
    );
}

export default Home;