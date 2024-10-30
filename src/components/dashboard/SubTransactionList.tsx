import { DollarSign } from "lucide-react";

interface SubTransactionListProps {
  subTransactionList: {
    id: string;
    item: string;
    amount: string;
    contributor?: string;
  }[];
}

const SubTransactionList = ({
  subTransactionList,
}: SubTransactionListProps) => {
  return (
    <>
      <div className="overflow-y-scroll max-h-64 ">
        {subTransactionList.map((element) => (
          <div key={element.id} className="grid grid-cols-3">
            <div className="text-sm">{element.item}</div>
            <div className="flex items-center">
              <DollarSign size={"14px"} />
              <div className="text-sm">{element.amount}</div>
            </div>
            <div className="text-sm">{element.contributor}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SubTransactionList;
