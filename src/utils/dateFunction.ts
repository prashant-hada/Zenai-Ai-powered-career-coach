import { format, parse } from "date-fns";

const formatDisplayDate = (dateString:string)=>{
  if(!dateString) return '';

  const date = parse(dateString, 'yyyy-MM', new Date());
  return format(date, 'MMM yyyy');
}

export default formatDisplayDate;