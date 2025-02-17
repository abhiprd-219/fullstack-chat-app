import React, { useEffect, useState } from 'react';
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const GroupChat = () => {
  const { groupMessages, getGroupMessages, sendGroupMessage, setSelectedGroup } = useChatStore();
  const { authUser } = useAuthStore();
  const [message, setMessage] = useState('');
  const [groups, setGroups] = useState([]);  // To store the groups list

  useEffect(() => {
    // Fetch the groups
    // Assuming you have an API for fetching groups the user is in
    axiosInstance.get('/groupChat/user-groups').then((response) => {
      setGroups(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      getGroupMessages(selectedGroup._id);  // Fetch group messages when group is selected
      subscribeToGroupMessages();  // Subscribe to group messages
    }
    return () => {
      unsubscribeFromGroupMessages();  // Clean up when component unmounts
    };
  }, [selectedGroup]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    sendGroupMessage({ message });
    setMessage('');
  };

  return (
    <div>
      <div>
        <h2>Groups</h2>
        <ul>
          {groups.map((group) => (
            <li key={group._id} onClick={() => setSelectedGroup(group)}>
              {group.name}
            </li>
          ))}
        </ul>
      </div>

      {selectedGroup && (
        <div>
          <h3>{selectedGroup.name}</h3>
          <div>
            {groupMessages.map((msg) => (
              <div key={msg._id}>
                <strong>{msg.senderId.fullName}:</strong> {msg.message}
              </div>
            ))}
          </div>

          <input 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
