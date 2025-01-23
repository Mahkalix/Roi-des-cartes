import React, { Component } from 'react';
import io from 'socket.io-client';

class RoomConnection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: '',
            userId: '',
            messages: [],
            inputMessage: '',
        };

        this.socket = null;
    }

    componentDidMount() {
        // Initialisez la connexion Socket.IO
        this.socket = io('http://localhost:4000'); // Remplacez par l'URL de votre backend

        // Écoutez les événements du serveur
        this.socket.on('message', (message) => {
            this.setState((prevState) => ({
                messages: [...prevState.messages, message],
            }));
        });

        this.socket.on('player_joined', ({ userId }) => {
            this.addSystemMessage(`Player ${userId} joined the room.`);
        });

        this.socket.on('puzzle_solved', (data) => {
            this.addSystemMessage(`Puzzle solved by Player ${data.userId}!`);
        });
    }

    componentWillUnmount() {
        // Déconnectez le socket lors du démontage du composant
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    joinRoom = async () => {
        const { roomId, userId } = this.state;

        // Appelez l'API pour rejoindre la chambre
        try {
            const response = await fetch(`/api/rooms/${roomId}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player_id: userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to join the room.');
            }

            // Émettez un événement pour informer les autres joueurs
            this.socket.emit('join_room', { roomId, userId });
            this.addSystemMessage(`You joined the room ${roomId}.`);
        } catch (error) {
            console.error(error);
        }
    };

    sendMessage = () => {
        const { roomId, userId, inputMessage } = this.state;
        if (inputMessage.trim() === '') return;

        const message = { roomId, userId, text: inputMessage };

        // Émettez un message via le socket
        this.socket.emit('message', message);

        // Ajoutez le message localement
        this.setState((prevState) => ({
            messages: [...prevState.messages, { userId: 'You', text: inputMessage }],
            inputMessage: '',
        }));
    };

    addSystemMessage = (text) => {
        this.setState((prevState) => ({
            messages: [...prevState.messages, { userId: 'System', text }],
        }));
    };

    render() {
        const { roomId, userId, messages, inputMessage } = this.state;

        return (
            <div className="room-connection">
                <h1>Room Connection</h1>
                <div>
                    <label>
                        Room ID:
                        <input
                            type="text"
                            value={roomId}
                            onChange={(e) => this.setState({ roomId: e.target.value })}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        User ID:
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => this.setState({ userId: e.target.value })}
                        />
                    </label>
                </div>
                <button onClick={this.joinRoom}>Join Room</button>

                <div className="messages">
                    <h2>Messages</h2>
                    <ul>
                        {messages.map((msg, index) => (
                            <li key={index}>
                                <strong>{msg.userId}:</strong> {msg.text}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="send-message">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => this.setState({ inputMessage: e.target.value })}
                        placeholder="Type a message..."
                    />
                    <button onClick={this.sendMessage}>Send</button>
                </div>
            </div>
        );
    }
}

export default RoomConnection;
