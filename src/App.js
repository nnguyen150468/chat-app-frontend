import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Moment from 'react-moment';
import socketIOClient from "socket.io-client";
const socket = socketIOClient("https://nguyen-chat-app-backend.herokuapp.com/");

function App() {
  const [chat, setChat] = useState("")
  const [chatLog, setChatLog] = useState([])
  const chatLogRef = useRef(chatLog)
  const [name, setName] = useState("unknwn")

  

  useEffect(() => {
    let user

    while(!user){
      user = prompt("Please enter your name")
    }

    setName(user)
    chatConnection()
  }, [])

    

  const chatConnection = () => {
    socket.on("message", (msg)=> {
      
      chatLogRef.current.push(msg)
      console.log('newMessages', chatLogRef.current)
      setChatLog([...chatLogRef.current])

    })
  }

  
  const renderChat = () => {
    
    return chatLog.map(el => <div className="text-row"><div><strong>{el.name}: </strong><span className="text-bubble">{el.text}</span></div>
    <div className="createdAt"><Moment fromNow>{el.createdAt}</Moment></div></div>)
  }

  const handleChange = (e) => {
    setChat(e.target.value)
  }

  const submitChat = (e) => {
    e.preventDefault();

    let chatObj = {
      text: chat,
      name: name,
      createdAt: new Date().getTime()
    }

    setChat("")
    socket.emit("chat", chatObj, (errMessage) => {
      if(errMessage){
        return console.log(errMessage)
      }
    })
  }

  
  return (
    <div className="whole-body">
      <nav className="navBar">
        <img className="profile-pic" src="https://ih1.redbubble.net/image.394724457.9721/flat,750x1000,075,f.jpg"/>
        <div className="userName">{name}</div>
      </nav>
      <div className="chatbox">
        <form className="form" onChange={handleChange} onSubmit={(e)=>submitChat(e)}>
          <input className="inputBar" name="chat" type="text" value={chat}></input>
          <button className="chatButton" type="submit">chat</button>
        </form>
      </div>
      <div className="chat-log">
        {renderChat()}
      </div>
    </div>
  );
}

export default App;
