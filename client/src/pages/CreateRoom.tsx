import React from 'react'

interface CreateRoomProps {

}

const CreateRoom: React.FC<CreateRoomProps> = ({}) => {
<<<<<<< HEAD
=======
    const roomName = useRef<HTMLInputElement>(null);
>>>>>>> parent of d00a724 (create room //  merge conflict fixed)
    return (
        <>
            <div className="containerContainer">
                <div className="container">
<<<<<<< HEAD
                    <h2>Create</h2>
=======
                    <h2>Create Room</h2>
                    <input className="center" ref={roomName} type="text"/>
                    <br/>
                    <button className="center" >Create</button>
>>>>>>> parent of d00a724 (create room //  merge conflict fixed)
                </div>
            </div>
        </>
    );
}

export default CreateRoom;