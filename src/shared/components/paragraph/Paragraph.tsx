import { ParagraphModel } from "@/shared/models/Paragraph.model";

const Paragraph = ({ label, ...props }: ParagraphModel) => {
  return <p {...props}>{label}</p>;
};

export default Paragraph;
