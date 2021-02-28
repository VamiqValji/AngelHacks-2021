import { watch } from 'fs';
import React from 'react'
import img  from '../imgs/logo.svg'

interface HomeProps {

}

const Home: React.FC<HomeProps> = ({}) => {
    return (
        <>
            <div className="containerContainer">
                <div className="container">
                    <h1 className="center"><span className="watch">watch</span>Socket</h1>
                    <img src={img} alt="logo"  className="center"
                    style = { {margin: "auto", width: "500px", height: "482px"}}
                    />
                    <br/>
                    <br/>
                    <h3>watchSocket is a website you can use to watch all your favourite video's with your friends!</h3>
                    <h3 className="center">Click Create To Start!</h3>

                </div>
            </div>
        </>
    );
}

export default Home;