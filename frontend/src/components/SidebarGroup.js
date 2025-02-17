// components/Sidebar.js
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
  const { groups, selectedGroup, setSelectedGroup } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <span className="font-medium hidden lg:block">Groups</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {groups.map((group) => (
          <button
            key={group._id}
            onClick={() => setSelectedGroup(group)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedGroup?._id === group._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={group.profilePic || "/avatar.png"}
                alt={group.name}
                className="size-12 object-cover rounded-full"
              />
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-medium truncate">{group.name}</div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;