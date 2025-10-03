import type { Meta, StoryObj } from "@storybook/nextjs";
import { FaPlus, FaTrash } from "react-icons/fa";
import ButtonIcon from "./ButtonIcon";

const meta: Meta<typeof ButtonIcon> = {
  title: "Componentes/Ui/ButtonIcon",
  component: ButtonIcon,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
    icon: { control: false },
    className: { control: "text" },
    disabled: { control: "boolean" },
    size: {
      control: { type: "number", min: 10, max: 100 },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ButtonIcon>;

export const Padrao: Story = {
  args: {
    icon: <FaPlus />,
    size: 40,
    className: "bg-primary text-white hover:bg-accent",
  },
};

export const Desabilitado: Story = {
  args: {
    icon: <FaTrash />,
    disabled: true,
    size: 40,
  },
};

export const Personalizado: Story = {
  args: {
    icon: <FaPlus />,
    className: "bg-green-500 text-white hover:bg-green-600",
    size: 50,
  },
};
