import type { Meta, StoryObj } from "@storybook/react";
import { UserAccountNav } from "./index";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof UserAccountNav> = {
  title: "Feature/UserAccountNav",
  component: UserAccountNav,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof UserAccountNav>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    name: "田中太郎",
    email: "tanaka@tarou.com",
    image: "https://placehold.jp/red/150x150.png",
  },
};
export const Nodata: Story = {
  args: {
    name: undefined,
    email: "tanaka@tarou.com",
    image: undefined,
  },
};
