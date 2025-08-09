import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Input from "@/shared/components/input/Input";

const meta: Meta<React.ComponentProps<typeof Input>> = {
  title: "Components/Input",
  component: Input,
  argTypes: {
    label: { control: "text" },
    inputMode: { control: "text" },
    type: { control: "text" },
    className: { control: "text" },
    name: { control: "text" },
    id: { control: "text" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
    onChange: { action: "changed" },
  },
};

export default meta;

type Story = StoryObj<React.ComponentProps<typeof Input>>;

export const Default: Story = {
  args: {
    label: "Valor",
    inputMode: "decimal",
    type: "text",
    className:
      "max-w-[355px] h-12 px-4 text-gray-900 bg-gray-100 border border-bb-green rounded-md focus:outline-none focus:ring-2 focus:border-bb-green",
    name: "valueOfTransaction",
    id: "valueOfTransactionId",
    placeholder: "R$ 0,00",
    required: true,
  },
};
