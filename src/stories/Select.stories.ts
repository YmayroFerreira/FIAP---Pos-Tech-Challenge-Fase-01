import Select from "@/shared/components/select/Select";
import { SelectModel } from "@/shared/models/Select.model";
import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    defaultTextOption: {
      control: "text",
      description: "Texto padrão exibido na primeira opção (desabilitada)",
    },
    options: {
      control: "object",
      description: "Lista de opções do select",
    },
    onChange: {
      action: "changed",
      description: "Evento disparado ao selecionar uma opção",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    defaultTextOption: "Selecione uma opção",
    options: [
      { option: "Opção 1", value: "1" },
      { option: "Opção 2", value: "2" },
      { option: "Opção 3", value: "3" },
    ],
  } as SelectModel,
};

export const WithManyOptions: Story = {
  args: {
    defaultTextOption: "Escolha...",
    options: Array.from({ length: 10 }, (_, i) => ({
      option: `Opção ${i + 1}`,
      value: String(i + 1),
    })),
  } as SelectModel,
};

export const EmptyOptions: Story = {
  args: {
    defaultTextOption: "Nenhuma opção disponível",
    options: [],
  } as SelectModel,
};
