import { useEffect, useState } from "react";
import { fetchTransactionList, getUser } from "../lib/utils";
import { Transactions } from "../shared/types";

const useFetchTransactions = (groupId: string, activityId: string) => {
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);

      if (groupId && activityId) {
        const transactionList = await fetchTransactionList(activityId);

        const response: Transactions[] = [];
        transactionList.forEach((doc) => {
          const id = doc.id;
          const item = doc.data().item;
          const totalAmount = doc.data().totalAmount;
          const splitOption = doc.data().splitOption;
          const payerId = doc.data().payerId;

          getUser(groupId, payerId).then((result) => {
            const transactionObj = {
              id,
              item,
              totalAmount,
              splitOption,
              payer: result,
            };
            response.push(transactionObj);
          });
        });
        setTransactions(response);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };
    fetchTransactions();
  }, [groupId, activityId]);
  return { transactions, isLoading } as const;
};

export default useFetchTransactions;
