"use client";

import { GithubPresenter } from "./index.presenter";
import { signIn } from "next-auth/react";
import React, { useState } from "react";

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
