import React, { useState } from 'react'
import { ClientSocket, useSocket } from "use-socketio"

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [receiver, setReceiver] = useState('all')
  const [clients, setClients] = useState([])

  const socketMessage = useSocket("message", message => setMessages([...messages, message]))

  const socketClient = useSocket("clients", clients => setClients(clients))

  const addMessage = message => {
    setMessages([...messages, message])
    socketMessage.emit('message', message)
  }

  const changePseudo = pseudo => {
    setPseudo(pseudo)
    socketClient.emit('changePseudo', {socketID: socketClient.id, pseudo})
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <div style={{marginLeft: '30px'}}><h1>Chat</h1></div>
        <div>Pseudo: <input onChange={e => changePseudo(e.target.value)} style={{borderStyle: 'solid', borderRadius: '10px', padding: '8px', margin: '20px 20px 0 0'}} /></div>
      </div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{display: 'flex', flexDirection: 'column', margin: '30px', padding: '10px'}}>
          {clients.length !== 0 && clients.map((client, index) => (
            <div style={{padding: '10px', border: '1px solid gray'}} key={index}>{client.customPseudo ? client.customPseudo : client.pseudo}</div>
          ))}
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div>
            <h3 style={{marginLeft: '30px'}}>Messages</h3>
            {messages.length !== 0 && messages.map((message, index) => (
              <div key={index}>
                <div style={{display: 'flex', flexDirection: 'column', background: '#F7F7F7', borderRadius: '15px', margin: '30px', minWidth: '400px'}}>
                  <div style={{padding: '15px'}}>{message.receiver !== 'all' && <b>Message Privée -</b>} <b>{message.pseudo}</b></div>
                  <div style={{padding: '0 15px 15px 15px'}}>{message.content}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', margin: '10px 30px',}}>
            <div>
              <textarea style={{padding: '10px', minWidth: '400px'}} onChange={e => setContent(e.target.value)} />
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
              <div>
                <select onChange={e => setReceiver(e.target.value)}>
                <option key={0} value="all">Tout le monde</option>
                  {
                    clients.length !== 0 && clients.map(client => (
                      <option key={client.ID} value={client.ID}>
                        {client.customPseudo ? client.customPseudo : client.pseudo}
                      </option>
                    ))
                  }
                </select>
              </div>
              <div>
                <button onClick={() => addMessage({receiver, content, pseudo: pseudo ? pseudo : socketClient.id})}>Envoyer message</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const App = () => (
  <ClientSocket url={process.env.REACT_APP_SERVER}>
    <Chat />
  </ClientSocket>
)

export default App

