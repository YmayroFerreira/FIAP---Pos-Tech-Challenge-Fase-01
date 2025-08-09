import HeaderWithProvider from "../stories/HeaderWithProvider";
import type { Meta, StoryObj } from "@storybook/nextjs";

const meta = {
  title: "Example/Header",
  component: HeaderWithProvider,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof HeaderWithProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
