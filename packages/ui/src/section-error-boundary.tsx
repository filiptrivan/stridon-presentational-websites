"use client";

import * as Sentry from "@sentry/nextjs";
import { Component, type ReactNode } from "react";
import { SectionError } from "./section-error";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return <SectionError />;
    }
    return this.props.children;
  }
}
