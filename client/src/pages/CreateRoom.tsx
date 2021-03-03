import { useRef, useEffect, useState } from 'react';
import axios from "axios";
import {Link} from "react-router-dom";

interface CreateRoomProps {
    // socket: CreateRoomProps
}

const CreateRoom: React.FC<CreateRoomProps> = ({}) => {

    const roomName = useRef<any>();
    const inputName = useRef<HTMLInputElement>(null);
    const linkRef = useRef<any>(null);
    const [gotSuccessRes, setGotSuccessRes] = useState<boolean>(false);
    const [gotFailedRes, setGotFailedRes] = useState<boolean>(false);
    const [roomID, setRoomID] = useState<string>("");

    
    const joinRoom = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // http://localhost:3001 locally
            const resp = await axios.post("https://watchsocket.herokuapp.com/s/create", 
            {
                name: inputName.current?.value,
                roomName: roomName.current?.value
            });
            console.log("res data: ", resp.data);
            setGotSuccessRes(true);
            setGotFailedRes(false);
            setRoomID(resp.data.roomID);
        } catch (err) {
            setGotSuccessRes(false);
            setGotFailedRes(true);
            console.error(err);
        }

        // axios
        // .post("http://localhost:3001/create", {
        //     roomName: roomName.current?.value,
        // })
        // .then((res) => {
        //     console.log("res data: ", res.data);
        // })
        // .catch((err) => {
        //     console.warn(err);
        // });
    }

    const copyToClipboard = () => {
        linkRef.current.select();
        linkRef.current.setSelectionRange(0, 99999);
        document.execCommand("copy");
    }

    const checkMax = () => {
        if (roomName.current?.value >= 10) {
            roomName.current.value = roomName.current?.value.slice(0, 10);
        }
    }

    return (
        <>
            <div className="containerContainer">
                <div className="container">
                <div className="joinCreateContainer">
                    <div className="joinCreate">
                    <h2>Create Room</h2>
                    <form onSubmit={(e) => joinRoom(e)} >
                        <h3 style={{margin:10}} className="center">Room Name</h3>
                        <span className="center" >
                        <input className="center" onChange={checkMax} ref={roomName} type="text" placeholder="Enter room name..." required />
                        </span>
                        <br/>
                        {/* <h3 style={{margin:10, marginTop:-10}} className="center">Username</h3>
                        <span className="center" >
                        <input className="center" ref={inputName} type="text" placeholder="Enter your name..." />
                        </span>
                        <br/> */}
                        <button style={{marginTop:-10}} className="center">Create</button>
                    </form>
                    { gotSuccessRes ? ( // roomID.length > 3
                        <>
                            <div style={{marginTop:20}}>Give this link to your friends!</div>
                            <br/>
                            <span style={{marginTop:-20}} className="center" >
                            <input ref={linkRef} type="text" value={`${window.location.href.replace("/create", "/room/")}${roomID}`} placeholder="Link To Room" />
                            </span>
                            <br/>
                            <button style={{marginTop:-20, fontSize:15}} className="center" onClick={copyToClipboard}>Copy Me!</button>
                            <br/>
                            <Link to={`/room/${roomID}`}><button style={{marginTop:-15, fontSize:20}} className="center">Take me there!</button></Link>
                        </>
                    ) : (
                        <>
                            {gotFailedRes && <span className="c error">Error</span> }
                        </>
                    )}
                    </div>
                </div>
                </div>
            </div>
        </>
    );
}

export default CreateRoom;