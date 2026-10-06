import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

// Not animated on purpose: an entrance animation starts at an inline
// `opacity: 0` in the HTML, so without JavaScript the block stays invisible.
const Container = ({ children, className }: Props) => {
  return <div className={className}>{children}</div>;
};

export default Container;
