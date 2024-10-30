import { Card, CardContent } from "../ui/card";
import { Transactions } from "../../shared/types";

interface TransactionListProps {
  list: Transactions[];
}

const TransactionList = ({ list }: TransactionListProps) => {
  return (
    <>
      <div className="overflow-y-scroll max-h-96 ">
        {list.map(({ id, item, totalAmount, splitOption, payer }) => (
          <Card
            className="border border-gray-200 shadow-md w-[300px] m-5 pt-5"
            key={id}
          >
            <CardContent>
              <div className="text-[20px] mb-2">Split {splitOption}</div>

              <div className="text-sm">Item: {item}</div>
              <div className="text-sm">Total Amount: ${totalAmount}</div>
              <div className="text-sm mt-8">{payer} paid</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default TransactionList;
