import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useUserContext } from "../../context/UserContext";
import { generateContactOptions } from "../../lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import StandardCard from "../shared/StandardCard";
import SelectInput from "../select/SelectInput";
import useFetchGroups from "../../hooks/useFetchGroups";
import UserList from "./UserList";

type Contact = {
  contributor: string;
  amount: number;
};

type IndividualContact = {
  id: string;
  value: string;
};

const GroupInfo = () => {
  const { user } = useUserContext();

  const userUid = user?.uid;
  const { groups } = useFetchGroups(userUid);
  const [selectedGroup, setSelectedGroup] = useState("");
  const groupNameRef = useRef<HTMLInputElement>(null);

  const [groupRefId, setGroupRefId] = useState("");
  const [contactId, setContactId] = useState("");
  const [groupTitle, setGroupTitle] = useState("");
  const [contacts, setContacts] = useState<Contact>({
    contributor: "",
    amount: 0,
  });
  const [userContacts, setUserContacts] = useState<IndividualContact[]>([]);
  const navigate = useNavigate();

  const handleAddGroupName = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!groupNameRef.current) return;
    if (userUid && groupNameRef.current) {
      const value = groupNameRef.current.value;
      const newGroup = await addDoc(
        collection(db, "groupList", userUid, "groups"),
        {
          groupName: value,
          activityId: null,
        }
      );
      const newGroupId = newGroup.id;
      setGroupRefId(newGroupId);
    }
  };

  useEffect(() => {
    if (userUid && groupRefId) {
      const unsubscribe = onSnapshot(
        doc(db, "groupList", userUid, "groups", groupRefId),
        (doc) => {
          const data = doc.data();
          const name = data?.groupName;
          setGroupTitle(name);
        }
      );
      return () => {
        unsubscribe();
      };
    }
  }, [userUid, groupRefId]);

  const handleAddContact = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (contacts.contributor === "") return;
    const newContact = await addDoc(
      collection(db, "groupContactList", groupRefId, "groupContacts"),
      contacts
    );
    const newContactId = newContact.id;
    setContactId(newContactId);

    setContacts({
      contributor: "",
      amount: 0,
    });
  };

  useEffect(() => {
    if ((groupRefId && contactId) || groupRefId) {
      generateContactOptions(groupRefId).then((result) =>
        setUserContacts(result)
      );
    }
  }, [groupRefId, contactId]);

  const handleDeleteContact = async (id: string): Promise<void> => {
    await deleteDoc(
      doc(db, "groupContactList", groupRefId, "groupContacts", id)
    );
    generateContactOptions(groupRefId).then((result) =>
      setUserContacts(result)
    );
  };

  const handleSubmit = async () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    if (selectedGroup) {
      groups.forEach((item) => {
        if (item.id === selectedGroup) {
          setGroupRefId(item.id);
        }
      });
    }
  }, [selectedGroup, groups]);

  return (
    <>
      <div className="justify-center items-center">
        <div className="mb-9 mt-8 mx-20 md:mx-80">
          <SelectInput
            options={groups}
            onChange={setSelectedGroup}
            text="Groups"
          />
        </div>
        {/* <div className="justify-center items-center m-5 space-y-8 h-1/2 md:flex md:mx-36 md:space-y-0 md:gap-10"> */}
        <div className="justify-center items-center m-5 space-y-8 h-1/2 md:flex md:mx-36 md:space-y-0 md:gap-10">
          <StandardCard
            title={`${
              selectedGroup ? "Edit Contacts" : "Create Group and Add Contacts"
            }`}
          >
            {!groupRefId && (
              <>
                <div className="space-y-3">
                  <Input
                    placeholder="Enter group name"
                    type="text"
                    ref={groupNameRef}
                  />
                  <Button
                    className="w-full"
                    type="submit"
                    onClick={handleAddGroupName}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
            {groupRefId && (
              <>
                <div className="space-y-3">
                  <Input
                    placeholder="Enter contact name"
                    type="text"
                    value={contacts.contributor}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setContacts({ ...contacts, contributor: e.target.value })
                    }
                  />
                  <Button
                    className="w-full"
                    type="submit"
                    onClick={handleAddContact}
                  >
                    Submit
                  </Button>
                </div>
              </>
            )}
          </StandardCard>
          <StandardCard title={groupTitle}>
            <UserList
              userContacts={userContacts}
              handleDeleteContact={handleDeleteContact}
            />
          </StandardCard>
        </div>
        <div className="flex justify-center">
          <Button
            className="w-3/6 mt-8 mb-10"
            type="submit"
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </div>
      </div>
    </>
  );
};

export default GroupInfo;
