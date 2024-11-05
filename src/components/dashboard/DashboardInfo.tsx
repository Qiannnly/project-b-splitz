import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useUserContext } from "../../context/UserContext";
import { db } from "../../firebaseConfig";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import useFetchGroups from "../../hooks/useFetchGroups";
import useFetchTransactions from "../../hooks/useFetchTransactions";
import {
  fetchActivityDetails,
  generateContactOptions,
  fetchTransactionList,
  fetchSubTransactionList,
} from "../../lib/utils";
import TransactionList from "./TransactionList";
import TripTransactions from "./TripTransactions";
import SelectInput from "../select/SelectInput";
import StandardCard from "../shared/StandardCard";
import SplitOptionButtons from "./SplitOptionButtons";
import { Transactions, Options } from "../../shared/types";
import SplitMessageModal from "./SplitMessageModal";

type ActivityData = {
  activityTitle: string;
  currentGroup: string;
  activityStatus: boolean;
};
const DashboardInfo = () => {
  const { user } = useUserContext();
  const userUid = user?.uid;
  const { groups, currentActivityId, currentGroupId } = useFetchGroups(userUid);
  const { transactions, isLoading } = useFetchTransactions(
    currentGroupId,
    currentActivityId
  );
  const activityNameRef = useRef<HTMLInputElement>(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [activityData, setActivityData] = useState<ActivityData>({
    activityTitle: "",
    currentGroup: "",
    activityStatus: true,
  });
  const [activityId, setActivityId] = useState("");
  const [userTransactions, setUserTransactions] = useState<Transactions[]>([]);
  const [groupContacts, setGroupContacts] = useState<Options[]>([]);
  const [splitOption, setSplitOption] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const numContacts = Number(groupContacts.length);
  let sumOfEqualSplit = 0;

  useEffect(() => {
    if (currentActivityId && currentGroupId) {
      setActivityId(currentActivityId);
      setSelectedGroup(currentGroupId);
      fetchActivityInfo(currentActivityId, currentGroupId);
    }
  }, [currentActivityId, currentGroupId]);

  useEffect(() => {
    if (transactions) {
      setUserTransactions(transactions);
    }
  }, [transactions]);

  const fetchActivityInfo = async (activityId: string, groupId: string) => {
    const activityInfo = {
      activityTitle: "",
      currentGroup: "",
      activityStatus: true,
    };
    groups.forEach((group) => {
      if (group.id === groupId) {
        const groupName = group.value;
        activityInfo.currentGroup = groupName;
      }
    });
    if (userUid) {
      const activityDetails = await fetchActivityDetails(userUid, activityId);
      const activityName = activityDetails?.activity;
      const activityStatus = activityDetails?.isActivityCompleted;
      activityInfo.activityTitle = activityName;
      activityInfo.activityStatus = activityStatus;
      setActivityData(activityInfo);
    }

    const contactOptions = await generateContactOptions(groupId);
    setGroupContacts(contactOptions);
  };

  const handleAddActivity = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!selectedGroup) return;

    if (userUid && activityNameRef.current && selectedGroup) {
      const activityName = activityNameRef.current.value;
      const newActivity = await addDoc(
        collection(db, "activityList", userUid, "activities"),
        {
          activity: activityName,
          isActivityCompleted: false,
          selectedGroupId: selectedGroup,
        }
      );
      const newActivityId = newActivity.id;
      setActivityId(newActivityId);
      const currentGroupId = doc(
        db,
        "groupList",
        userUid,
        "groups",
        selectedGroup
      );
      await updateDoc(currentGroupId, {
        activityId: newActivityId,
      });
      fetchActivityInfo(newActivityId, selectedGroup);
    }
  };

  const calculateContributions = async () => {
    const subTransactionList = await fetchSubTransactionList(activityId);

    const contributions = new Map<string, number>();

    subTransactionList.forEach((doc) => {
      const contributorId = doc.data().contributorId;
      const amount = doc.data().amount;

      if (contributions.has(contributorId)) {
        const currentAmount = contributions.get(contributorId);

        const newAmount = Number(currentAmount) + Number(amount);
        contributions.set(contributorId, newAmount);
      } else {
        contributions.set(contributorId, amount);
      }
    });
    return contributions;
  };

  const calculateContributionsWithAmountPaid = async (
    payerContributions: Map<string, number>
  ) => {
    const transactionList = await fetchTransactionList(activityId);
    const copiedPayerContributions = new Map([...payerContributions]);

    if (copiedPayerContributions.size === 0) {
      groupContacts.forEach(({ id }) => {
        copiedPayerContributions.set(id, 0);
      });
    }
    transactionList.forEach((doc) => {
      const payerNameId = doc.data().payerId;
      const totalAmount = Number(doc.data().totalAmount);
      const splitOption = doc.data().splitOption;

      if (splitOption === "evenly") {
        sumOfEqualSplit += totalAmount;
      }
      if (copiedPayerContributions.has(payerNameId)) {
        const currentAmt = copiedPayerContributions.get(payerNameId);

        const newAmount = Number(currentAmt) - Number(totalAmount);
        copiedPayerContributions.set(payerNameId, newAmount);
      } else {
        copiedPayerContributions.set(payerNameId, totalAmount);
      }
    });
    return copiedPayerContributions;
  };

  const calculateAmountSpent = (
    contributionsAndTransactionsMap: Map<string, number>,
    equalSplitAmount: number
  ) => {
    const copiedContributionsAndTransactionsMap = new Map([
      ...contributionsAndTransactionsMap,
    ]);
    groupContacts.forEach(({ id }) => {
      if (copiedContributionsAndTransactionsMap.has(id)) {
        const currentAmount = copiedContributionsAndTransactionsMap.get(id);

        const newAmount = Number(currentAmount) + Number(equalSplitAmount);
        copiedContributionsAndTransactionsMap.set(id, newAmount);
      } else {
        copiedContributionsAndTransactionsMap.set(id, equalSplitAmount);
      }
    });

    return copiedContributionsAndTransactionsMap;
  };

  const getUsername = (arr: string[]) => {
    const arrayWithNames: string[] = [];

    for (let i = 0; i < arr.length; i += 1) {
      for (let j = 0; j < groupContacts.length; j += 1) {
        if (arr[i] === groupContacts[j].id) {
          arrayWithNames.push(groupContacts[j].value);
        }
      }
    }
    return arrayWithNames;
  };

  const handleCalculate = async () => {
    const contributionsMap = await calculateContributions();
    const contributionsTransactionMap =
      await calculateContributionsWithAmountPaid(contributionsMap);

    const equalContributions = sumOfEqualSplit / numContacts;

    const amountSpent = calculateAmountSpent(
      contributionsTransactionMap,
      equalContributions
    );
    const sortedAmountSpent = new Map(
      [...amountSpent.entries()].sort((a, b) => a[1] - b[1])
    );

    const sortedAmountSpentArray = Array.from(
      sortedAmountSpent,
      ([userId, amount]) => ({
        userId,
        amount,
      })
    );

    const userIdArray: string[] = [];
    const amountArray: number[] = [];

    for (let i = 0; i < sortedAmountSpentArray.length; i += 1) {
      userIdArray.push(sortedAmountSpentArray[i].userId);
      amountArray.push(sortedAmountSpentArray[i].amount);
    }

    const newUserIdArray = getUsername(userIdArray);

    calculateSplit(newUserIdArray, amountArray);
    setIsModalOpen(true);
  };

  const calculateSplit = async (
    userArray: string[],
    amountSpentArray: number[]
  ) => {
    if (!selectedUser) return;
    let i = 0;

    let j = userArray.length - 1;
    let debt;
    const text: string[] = [];
    let splitMessage;

    while (i < j) {
      debt = Math.min(-amountSpentArray[i], amountSpentArray[j]);
      amountSpentArray[i] += debt;
      amountSpentArray[j] -= debt;

      if (
        amountSpentArray[i] === amountSpentArray[j] &&
        debt === amountSpentArray[i]
      ) {
        debt = amountSpentArray[j];
        splitMessage = `${userArray[j]} owes ${userArray[i]} $${debt.toFixed(
          2
        )}`;
      }

      if (debt > 0) {
        splitMessage = `${userArray[j]} owes ${userArray[i]} $${debt.toFixed(
          2
        )}`;
      }
      if (splitMessage) {
        text.push(splitMessage);
      }

      if (amountSpentArray[i] === 0) {
        i++;
      }

      if (amountSpentArray[j] === 0) {
        j--;
      }
    }

    setMessage(text);
    reset();
  };

  const reset = async () => {
    if (userUid) {
      const groupRefDoc = doc(
        db,
        "groupList",
        userUid,
        "groups",
        selectedGroup
      );

      await updateDoc(groupRefDoc, {
        activityId: null,
      });
      const activityRefDoc = doc(
        db,
        "activityList",
        userUid,
        "activities",
        activityId
      );
      await updateDoc(activityRefDoc, {
        isActivityCompleted: true,
      });

      const activityDetails = await fetchActivityDetails(userUid, activityId);
      const status = activityDetails?.isActivityCompleted;
      setActivityData({
        ...activityData,
        activityStatus: status,
      });
      setUserTransactions([]);

      setActivityData({
        activityTitle: "",
        currentGroup: "",
        activityStatus: true,
      });
    }
  };

  const handleModal = () => {
    setIsModalOpen(false);
    reset();

    setMessage([]);
  };
  return (
    <>
      {isLoading && <div className="text-center">Loading...</div>}
      {!isLoading && (
        <div>
          <div>
            <div className=" justify-center items-center m-5 space-y-8 h-1/2 md:flex md:mx-36 md:space-y-0 md:gap-10 ">
              <StandardCard
                title={
                  activityData.activityStatus
                    ? "Create Activity"
                    : "Add Transactions"
                }
              >
                <div className="space-y-3">
                  {activityData.activityStatus && (
                    <>
                      <div className="space-y-6">
                        <Input
                          placeholder="Enter activity name"
                          type="text"
                          ref={activityNameRef}
                        />
                        <SelectInput
                          options={groups}
                          onChange={setSelectedGroup}
                          text="Groups"
                        />
                        <Button
                          className="w-full"
                          type="submit"
                          onClick={handleAddActivity}
                        >
                          Create
                        </Button>
                      </div>
                    </>
                  )}
                  {!activityData.activityStatus && (
                    <>
                      <SplitOptionButtons
                        splitOption={splitOption}
                        setSplitOption={setSplitOption}
                      />
                      <SelectInput
                        options={groupContacts}
                        onChange={setSelectedUser}
                        text="Payer"
                      />
                    </>
                  )}
                  {splitOption !== "" && !activityData.activityStatus && (
                    <TripTransactions
                      splitOption={splitOption}
                      selectedUser={selectedUser}
                      activityId={activityId}
                      groupId={selectedGroup}
                      groupContacts={groupContacts}
                      userTransactions={userTransactions}
                      setUserTransactions={setUserTransactions}
                    />
                  )}
                </div>
              </StandardCard>

              <StandardCard title={activityData.activityTitle}>
                {activityData.currentGroup && (
                  <div className="text-sm mb-2">
                    Group: {activityData.currentGroup}
                  </div>
                )}

                <TransactionList list={userTransactions} />
              </StandardCard>
            </div>
            {activityData.activityStatus === false && (
              <div className="flex mx-auto mt-8 mb-10 justify-center items-center ">
                <Button onClick={handleCalculate}>Split transactions</Button>
              </div>
            )}
            <SplitMessageModal
              text={message}
              onClose={handleModal}
              isModalOpen={isModalOpen}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardInfo;
