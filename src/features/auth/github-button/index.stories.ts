import { GithubPresenter } from "./index.presenter";
import type { Meta, StoryObj } from "@storybook/react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof GithubPresenter> = {
  title: "Feature/GithubPresenter",
  component: GithubPresenter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GithubPresenter>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    isLoading: false,
    handleSubmit: () => alert("Hello world!"),
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    handleSubmit: () => alert("Hello world!"),
  },
};
