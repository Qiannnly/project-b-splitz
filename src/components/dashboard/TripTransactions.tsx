import { useState } from "react";
import { db } from "../../firebaseConfig";

import {
  addDoc,
  collection,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import SelectInput from "../select/SelectInput";
import SubTransactionList from "./SubTransactionList";
import { Transactions, Options } from "../../shared/types";
import { DollarSign } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type Transaction = {
  item: string;
  totalAmount: string;
  splitOption: string;
  payerId: string;
};

type SubTransaction = {
  id: string;
  item: string;
  amount: string;
};

type SubTransactions = {
  id: string;
  item: string;
  amount: string;
  contributor?: string;
  contributorId: string;
};

type Props = {
  splitOption: string;
  selectedUser: string;
  activityId: string;
  groupId: string;

  groupContacts: Options[];
  setUserTransactions: React.Dispatch<React.SetStateAction<Transactions[]>>;
  userTransactions: Transactions[];
};

const TripTransactions = ({
  splitOption,
  selectedUser,
  activityId,
  groupId,
  groupContacts,
  userTransactions,
  setUserTransactions,
}: Props) => {
  const [selectedContributor, setSelectedContributor] = useState("");
  const [subTransaction, setSubTransaction] = useState<SubTransaction>({
    id: "",
    item: "",
    amount: "",
  });
  const [subTransactionList, setSubTransactionList] = useState<
    SubTransactions[]
  >([]);
  const [transaction, setTransaction] = useState<Transaction>({
    item: "",
    totalAmount: "",
    splitOption: "",
    payerId: "",
  });
  const [subTransctionId, setSubTransactionId] = useState<string[]>([]);

  const subTransactionArr: string[] = [];

  const handleAddSubTransaction = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (
      subTransaction.item === "" ||
      subTransaction.amount === "" ||
      selectedContributor === ""
    )
      return;

    const subTransactionObj = {
      item: subTransaction.item,
      amount: subTransaction.amount,
      contributorId: selectedContributor,
    };

    const newSubTransaction = await addDoc(
      collection(db, "subTransactionList", activityId, "subTransactions"),
      subTransactionObj
    );

    const newSubTransactionId = newSubTransaction.id;

    setSubTransactionId([...subTransctionId, newSubTransactionId]);
    const currentSubTransaction = doc(
      db,
      "subTransactionList",
      activityId,
      "subTransactions",
      newSubTransactionId
    );
    const subTransactionDocSnap = await getDoc(currentSubTransaction);

    if (subTransactionDocSnap.exists()) {
      const subTransactionData = subTransactionDocSnap.data();

      groupContacts.forEach((groupContact) => {
        if (groupContact.id === selectedContributor) {
          const contributorName = groupContact.value;
          const newSubTransaction = {
            id: newSubTransactionId,
            item: subTransactionData.item,
            amount: subTransactionData.amount,
            contributor: contributorName,
            contributorId: selectedContributor,
          };
          setSubTransactionList([...subTransactionList, newSubTransaction]);
        }
        return subTransactionArr;
      });
      setSubTransaction({ id: "", item: "", amount: "" });
    }
  };

  const handleClearSubTransactions = async () => {
    subTransctionId.forEach(async (subTransactionId) => {
      await deleteDoc(
        doc(
          db,
          "subTransactionList",
          activityId,
          "subTransactions",
          subTransactionId
        )
      );
    });
    setSubTransactionId([]);
    setSubTransactionList([]);
  };

  const updateContributorAmount = async () => {
    let currentAmt = 0;
    const groupIds: string[] = [];
    groupContacts.forEach(({ id }) => {
      groupIds.push(id);
    });

    subTransactionList.forEach(async (item) => {
      const contributorId = item.contributorId;

      if (groupIds.includes(contributorId)) {
        const currentContributor = doc(
          db,
          "groupContactList",
          groupId,
          "groupContacts",
          contributorId
        );

        const individualContactSnap = await getDoc(currentContributor);

        if (individualContactSnap.exists()) {
          const individualContactData = individualContactSnap.data();
          currentAmt = individualContactData.amount;
          const newAmount = Number(currentAmt) + Number(subTransaction.amount);
          await updateDoc(currentContributor, {
            amount: newAmount,
          });
        }
      }
    });
  };

  const handleAddTransaction = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!selectedUser) return;

    await updateContributorAmount();

    const transactionItem: Transaction = {
      item: splitOption === "evenly" ? transaction.item : "Multiple items",
      totalAmount:
        splitOption === "evenly"
          ? transaction.totalAmount.toString()
          : calculateTotalFromSubTransaction().toString(),
      splitOption: splitOption,
      payerId: selectedUser,
    };

    const newTransaction = await addDoc(
      collection(db, "transactionList", activityId, "transactions"),
      transactionItem
    );

    const newTransactionId = newTransaction.id;

    const currentTransaction = doc(
      db,
      "transactionList",
      activityId,
      "transactions",
      newTransactionId
    );

    const transactionDocSnap = await getDoc(currentTransaction);

    if (transactionDocSnap.exists()) {
      const data = transactionDocSnap.data();
      const payerId = data.payerId;

      groupContacts.forEach((groupContact) => {
        if (groupContact.id === payerId) {
          const payerName = groupContact.value;
          const newTransaction = {
            id: newTransactionId,
            item: data.item,
            totalAmount: data.totalAmount,
            splitOption: data.splitOption,
            payer: payerName,
          };
          setUserTransactions([...userTransactions, newTransaction]);
        }
      });
    }
    updateIndividualTransaction();
    setSubTransactionList([]);
  };

  const calculateTotalFromSubTransaction = () => {
    let totalSubTransactionAmount = 0;

    subTransactionList.forEach((element) => {
      totalSubTransactionAmount += Number(element.amount);
    });
    return totalSubTransactionAmount;
  };

  const updateIndividualTransaction = async () => {
    const numContacts = groupContacts.length;
    groupContacts.forEach(async (element) => {
      const contributorRefId = doc(
        db,
        "groupContactList",
        groupId,
        "groupContacts",
        element.id
      );

      await updateDoc(contributorRefId, {
        amount: Number(transaction.totalAmount) / numContacts,
      });
    });
    setTransaction({ item: "", totalAmount: "", splitOption: "", payerId: "" });
  };

  return (
    <>
      <p className="text-sm font-bold">
        Split {splitOption === "evenly" ? "evenly" : "between"}
      </p>

      <form className="w-full items-center justify-center space-y-3 max-h-96">
        {splitOption === "evenly" && (
          <>
            <Input
              id="item"
              placeholder="Item"
              type="text"
              value={transaction.item}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTransaction({ ...transaction, item: e.target.value })
              }
              className="shadow-md"
            />
            <Input
              id="amount"
              placeholder="Amount"
              type="text"
              value={transaction.totalAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTransaction({
                  ...transaction,
                  totalAmount: e.target.value,
                })
              }
              className="shadow-md"
            />
          </>
        )}

        {splitOption === "between" && (
          <>
            <div className="flex items-center gap-5">
              <Input
                id="item"
                placeholder="Item"
                type="text"
                value={subTransaction.item}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSubTransaction({
                    ...subTransaction,
                    item: e.target.value,
                  })
                }
                className="shadow-md"
              />
              <div className="flex gap-1 items-center ">
                <DollarSign size={"20px"} />
                <Input
                  id="amount"
                  placeholder="Amount"
                  type="text"
                  value={subTransaction.amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSubTransaction({
                      ...subTransaction,
                      amount: e.target.value,
                    })
                  }
                  className="shadow-md"
                />
              </div>
            </div>
            <SelectInput
              options={groupContacts}
              onChange={setSelectedContributor}
              text="Contributors"
            />

            <div
              className="text-sm cursor-pointer underline"
              onClick={handleClearSubTransactions}
            >
              Clear
            </div>

            <SubTransactionList subTransactionList={subTransactionList} />

            <Button
              className="w-full"
              type="submit"
              onClick={handleAddSubTransaction}
            >
              Add more items
            </Button>
          </>
        )}
        <Button className="w-full" type="submit" onClick={handleAddTransaction}>
          Add transaction
        </Button>
      </form>
    </>
  );
};

export default TripTransactions;
