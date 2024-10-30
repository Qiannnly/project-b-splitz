import { Trash2 } from "lucide-react";

interface SubUserListProps {
  userContacts: {
    id: string;
    value: string;
  }[];
  handleDeleteContact: (value: string) => void;
}

const UserList = ({ userContacts, handleDeleteContact }: SubUserListProps) => {
  return (
    <>
      <div className="flex flex-wrap gap-2 overflow-y-scroll h-64">
        {userContacts.map((userContact) => {
          const { id, value } = userContact;
          return (
            <>
              <div className="flex items-center justify-between w-24 border h-9 border-gray-400 p-2 rounded-lg">
                <div key={id} className="text-sm">
                  {value}
                </div>
                <span onClick={() => handleDeleteContact(id)}>
                  {<Trash2 />}
                </span>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default UserList;
