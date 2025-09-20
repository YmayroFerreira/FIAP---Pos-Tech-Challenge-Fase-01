import Paragraph from "@/shared/components/paragraph/Paragraph";
import { ParagraphModel } from "@/shared/models/Paragraph.model";
import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof Paragraph> = {
  title: "Components/Paragraph",
  component: Paragraph,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Texto exibido dentro do parágrafo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Paragraph>;

export const Default: Story = {
  args: {
    label: "Este é um texto de exemplo para o componente Paragraph.",
  } as ParagraphModel,
};

export const LongText: Story = {
  args: {
    label:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  } as ParagraphModel,
};

export const Empty: Story = {
  args: {
    label: "",
  } as ParagraphModel,
};
