import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Options } from "../shared/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchGroups = async (userUid: string) => {
  const groupCollection = collection(db, "groupList", userUid, "groups");
  const groupQuerySnapshot = await getDocs(groupCollection);
  return groupQuerySnapshot;
};

export const fetchGroupContacts = async (groupId: string) => {
  const groupContactCollection = collection(
    db,
    "groupContactList",
    groupId,
    "groupContacts"
  );
  const groupContactQuerySnapshot = await getDocs(groupContactCollection);
  return groupContactQuerySnapshot;
};

export const generateContactOptions = async (groupId: string) => {
  const groupContacts = await fetchGroupContacts(groupId);

  const contactOptions: Options[] = [];
  groupContacts.forEach((doc) => {
    const contributorId = doc.id;
    const contributorName = doc.data().contributor;

    const contactInfo = {
      id: contributorId,
      value: contributorName,
    };
    contactOptions.push(contactInfo);
  });
  return contactOptions;
};

export const fetchActivityDetails = async (
  userId: string,
  activityId: string
) => {
  const activityRef = doc(db, "activityList", userId, "activities", activityId);

  const activityDocSnap = await getDoc(activityRef);

  if (activityDocSnap.exists()) {
    const data = activityDocSnap.data();
    const activity = data.activity;
    const isActivityCompleted = data.isActivityCompleted;

    const activityInfo = {
      activity,
      isActivityCompleted,
    };
    return activityInfo;
  }
};

export const fetchTransactionList = async (activityId: string) => {
  const transactionCollection = collection(
    db,
    "transactionList",
    activityId,
    "transactions"
  );
  const transactionQuerySnapshot = await getDocs(transactionCollection);
  return transactionQuerySnapshot;
};

export const getUser = async (groupId: string, id: string) => {
  const docRef = doc(db, "groupContactList", groupId, "groupContacts", id);

  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const payerName = data.contributor;
    return payerName;
  }
};

export const fetchSubTransactionList = async (activityId: string) => {
  const subTransactionCollection = collection(
    db,
    "subTransactionList",
    activityId,
    "subTransactions"
  );
  const subTransactionQuerySnapshot = await getDocs(subTransactionCollection);
  return subTransactionQuerySnapshot;
};
