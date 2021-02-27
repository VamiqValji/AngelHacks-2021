import { useRef } from 'react';

interface CreateRoomProps {

}

const CreateRoom: React.FC<CreateRoomProps> = ({}) => {
    const roomName = useRef<HTMLInputElement>(null);
    return (
        <>
            <div className="containerContainer">
                <div className="container">
                    <h2>Create Room</h2>
                    <input className="center" ref={roomName} type="text"/>
                    <br/>
                    <button className="center" >Create</button>
                </div>
            </div>
        </>
    );
}

export default CreateRoom;