import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const WelcomePage = () => {
  const { getUsers, users, isUsersLoading } = useChatStore();
  const { onlineUsers, addContact, authUser } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleAddContact = (contactId) => {
    addContact(contactId);
  };

  // Filter out users who are already in the logged-in user's contact list
  const filteredUsers = users.filter((user) => {
    return !authUser.contacts.includes(user._id);
  });

  return (
    <div className="w-full flex flex-col items-center p-8 bg-base-100/50 h-screen">
      <h2 className="text-2xl font-bold mb-6">Welcome to Marvel World!</h2>

      <div className="w-full max-w-2xl space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 150px)" }}>
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between bg-base-200 p-4 rounded-lg shadow-md"
          >
            <div className="flex items-center gap-4">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="w-12 h-12 object-cover rounded-full"
              />
              <div className="text-left">
                <div className="font-medium text-lg">{user.fullName}</div>
                <div className="text-sm text-gray-500">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleAddContact(user._id)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
              disabled={user.isContact} // Disable if already a contact
            >
              {user.isContact ? "Contact Added" : "Add Contact"}
            </button>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No users available to add
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
