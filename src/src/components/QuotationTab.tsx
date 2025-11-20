import React from "react";
import { QuotationItem } from "../../types";

interface Props {
  quotations: QuotationItem[];
  setQuotations: (items: QuotationItem[]) => void;
}

const QuotationTab: React.FC<Props> = ({ quotations }) => {
  return (
    <div>
      <h2>Quotations</h2>
      {quotations.map((q) => (
        <p key={q.id}>{q.partName}</p>
      ))}
    </div>
  );
};

export default QuotationTab;
