import React, { forwardRef } from 'react';

// A tiny defensive wrapper that forwards a ref to a DOM element.
// Use this when you need to ensure MUI Transition components receive a
// refable DOM node even if the wrapped child doesn't forward refs.
const TransitionRefWrapper = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  function TransitionRefWrapper({ children, className }, ref) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }
);

export default TransitionRefWrapper;
