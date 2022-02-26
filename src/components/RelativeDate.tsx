import { formatDistance } from "date-fns";
import React from "react";

interface DateProps {
  date: Date
}

const RelativeDate: React.FC<DateProps> = ({ date }) => {
  return <abbr title={date.toDateString()}>{formatDistance(date, new Date(), { addSuffix: true })}</abbr>;
};

export default RelativeDate;
