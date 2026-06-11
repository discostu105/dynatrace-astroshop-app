import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Text } from "@dynatrace/strato-components/typography";

interface GroupHeaderProps {
  title: string;
  count: number;
  icon?: string;
}

export const GroupHeader = ({ title, count, icon }: GroupHeaderProps) => {
  return (
    <Flex
      alignItems="center"
      gap={12}
      style={{
        padding: "16px 0 8px 0",
        borderTop: "1px solid var(--dt-colors-border-neutral-default)",
        marginTop: "16px",
      }}
    >
      {icon && <span style={{ fontSize: "16px" }}>{icon}</span>}
      <Text
        style={{
          fontSize: "13px",
          fontWeight: "600",
          color: "var(--dt-colors-text-default)",
          margin: 0,
          flex: 1,
        }}
      >
        {title}
      </Text>
      <div
        style={{
          padding: "2px 8px",
          borderRadius: "12px",
          backgroundColor: "var(--dt-colors-background-neutral)",
          fontSize: "12px",
          fontWeight: "600",
          color: "var(--dt-colors-text-secondary)",
          minWidth: "24px",
          textAlign: "center",
        }}
      >
        {count}
      </div>
    </Flex>
  );
};
