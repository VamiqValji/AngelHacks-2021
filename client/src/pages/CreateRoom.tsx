import { useRef, useEffect, useState } from 'react';
import axios from "axios";
import { BooleanLiteral } from 'typescript';

interface CreateRoomProps {
    // socket: CreateRoomProps
}

const CreateRoom: React.FC<CreateRoomProps> = ({}) => {

    const roomName = useRef<HTMLInputElement>(null);
    const inputName = useRef<HTMLInputElement>(null);
    const linkRef = useRef<any>(null);
    const [gotSuccessRes, setGotSuccessRes] = useState<boolean>(false);
    const [roomID, setRoomID] = useState<string>("");

    
    const joinRoom = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const resp = await axios.post('http://localhost:3001/create', 
            {
                name: inputName.current?.value,
                roomName: roomName.current?.value
            });
            console.log("res data: ", resp.data);
            setGotSuccessRes(true);
            setRoomID(resp.data.roomID);
        } catch (err) {
            setGotSuccessRes(false);
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

    return (
        <>
            <div className="containerContainer">
                <div className="container">
                    <div className="joinCreate">
                    <h2>Create Room</h2>
                    <form onSubmit={(e) => joinRoom(e)} >
                        <h3>Room Name</h3>
                        <input className="center" ref={roomName} type="text" placeholder="Enter room name..." />
                        <br/>
                        <h3>Username</h3>
                        <input className="center" ref={inputName} type="text" placeholder="Enter your name..." />
                        <br/>
                        <button className="center">Create</button>
                    </form>
                    { gotSuccessRes ? ( // roomID.length > 3
                        <>
                            <div>Give this link to your friends!</div>
                            <br/>
                            <input ref={linkRef} type="text" value={`${window.location.href.replace("/create", "/room/")}${roomID}`} placeholder="Link To Room" />
                            <br/>
                            <button onClick={copyToClipboard}>Copy Me!</button>
                        </>
                    ) : (
                        <></>
                    )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateRoom;