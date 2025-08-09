import Header from "@/core/components/Header";
import type { Meta, StoryObj } from "@storybook/nextjs";

const meta = {
  title: "Example/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    username: "My Username",
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    username: "Jane Doe",
  },
};
