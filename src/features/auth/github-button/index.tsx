"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { GithubPresenter } from "./index.presenter";

export const _GithubButton = () => {
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);

  const onSubmit = async () => {
    setIsGitHubLoading(true);
    await signIn("github", { callbackUrl: "/" });
  };

  return (
    <GithubPresenter isLoading={isGitHubLoading} handleSubmit={onSubmit} />
  );
};
