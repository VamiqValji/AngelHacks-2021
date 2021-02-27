import { useRef } from 'react';

interface CreateRoomProps {

}

const CreateRoom: React.FC<CreateRoomProps> = ({}) => {
    const roomName = useRef<HTMLInputElement>(null);

    const joinRoom = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(roomName.current?.value);
    }

    return (
        <>
            <div className="containerContainer">
                <div className="container">
                    <h2>Create Room</h2>
                    <form onSubmit={(e) => joinRoom(e)} >
                        <input className="center" ref={roomName} type="text"/>
                        <br/>
                        <button className="center">Create</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreateRoom;