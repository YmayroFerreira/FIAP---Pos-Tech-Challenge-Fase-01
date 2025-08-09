import Button from "@/shared/components/button/Button";
import { ButtonModel } from "@/shared/models/Button.model";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<ButtonModel> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    label: { control: "text" },
    variant: {
      control: "radio",
      options: ["primary", "secondary", "disabled"],
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    onClick: { action: "clicked" },
  },
};

export default meta;

type Story = StoryObj<ButtonModel>;

export const Primary: Story = {
  args: {
    label: "Primary Button",
    variant: "primary",
    size: "md",
    disabled: false,
  },
};

export const Secondary: Story = {
  args: {
    label: "Secondary Button",
    variant: "secondary",
    size: "md",
    disabled: false,
  },
};

export const Tertiary: Story = {
  args: {
    label: "Tertiary Button",
    variant: "tertiary",
    size: "md",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Button",
    variant: "disabled",
    size: "md",
    disabled: true,
  },
};
