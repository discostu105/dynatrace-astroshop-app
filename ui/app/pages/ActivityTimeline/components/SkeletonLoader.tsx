import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";

export const SkeletonLoader = () => {
  const skeletonStyle = {
    animation: "shimmer 2s infinite",
    backgroundColor: "var(--dt-colors-background-neutral)",
    borderRadius: "4px",
  };

  return (
    <div style={{ padding: "24px 24px" }}>
      <style>{`
        @keyframes shimmer {
          0% {
            background-color: var(--dt-colors-background-neutral);
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            background-color: var(--dt-colors-background-neutral);
            opacity: 0.6;
          }
        }
      `}</style>

      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: "16px",
            paddingBottom: "24px",
          }}
        >
          {/* Timeline node skeleton */}
          <div
            style={{
              ...skeletonStyle,
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              marginTop: "6px",
              flexShrink: 0,
            }}
          />

          {/* Card skeleton */}
          <div
            style={{
              flex: 1,
              backgroundColor: "white",
              border: "1px solid var(--dt-colors-border-neutral-default)",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <Flex gap={12} marginBottom={12}>
              {/* Avatar skeleton */}
              <div
                style={{
                  ...skeletonStyle,
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  flexShrink: 0,
                }}
              />
              <Flex flexDirection="column" gap={6} flex={1}>
                {/* Name skeleton */}
                <div
                  style={{
                    height: "14px",
                    width: "40%",
                    ...skeletonStyle,
                  }}
                />
                {/* Time skeleton */}
                <div
                  style={{
                    height: "12px",
                    width: "25%",
                    ...skeletonStyle,
                  }}
                />
              </Flex>
            </Flex>

            {/* Content skeleton */}
            <div style={{ paddingLeft: "52px" }}>
              <div
                style={{
                  height: "12px",
                  marginBottom: "8px",
                  width: "100%",
                  ...skeletonStyle,
                }}
              />
              <div
                style={{
                  height: "12px",
                  marginBottom: "8px",
                  width: "95%",
                  ...skeletonStyle,
                }}
              />
              <div
                style={{
                  height: "12px",
                  width: "60%",
                  ...skeletonStyle,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
