const socket = io();
const username = prompt("Enter your name");

function ChatApp() {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    socket.on("message", data => {
      setMessages(prev => [...prev, data]);
    });
  }, []);

  React.useEffect(() => {
    const msgBox = document.getElementById("msgBox");
    if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const msgData = {
      user: username,
      text: message,
      time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
    };

    socket.emit("message", msgData);
    setMessage("");
  };

  return (
    React.createElement("div", { className: "chat-container" },
      React.createElement("div", { className: "chat-header" }, "💬 Real-Time Chat"),
      React.createElement("div", { className: "messages", id: "msgBox" },
        messages.map((m, i) =>
          React.createElement("div", {
            key: i,
            className: `message ${m.user === username ? "self" : "other"}`
          },
            React.createElement("strong", {}, m.user),
            React.createElement("div", {}, m.text),
            React.createElement("div", { className: "time" }, m.time)
          )
        )
      ),
      React.createElement("div", { className: "chat-input" },
        React.createElement("input", {
          value: message,
          placeholder: "Type a message...",
          onChange: e => setMessage(e.target.value),
          onKeyDown: e => e.key === "Enter" && sendMessage()
        }),
        React.createElement("button", { onClick: sendMessage }, "➤")
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById("root"))
  .render(React.createElement(ChatApp));
