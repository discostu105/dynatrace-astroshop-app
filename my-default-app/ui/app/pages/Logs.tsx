import React from "react";

import { useDql } from "@dynatrace-sdk/react-hooks";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Paragraph } from "@dynatrace/strato-components/typography";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import Colors from "@dynatrace/strato-design-tokens/colors";
import { CriticalIcon } from "@dynatrace/strato-icons";

export const Logs = () => {
  const { data, error, isLoading } = useDql({
    query: "fetch logs | sort timestamp desc | limit 10",
  });

  return (
    <Flex flexDirection="column" alignItems="center" padding={32}>
      <Flex
        flexDirection="column"
        alignItems="center"
        paddingBottom={32}
        gap={8}
      >
        <Heading level={2}>Recent Logs</Heading>
        <Paragraph>Last 10 log records from your Dynatrace environment</Paragraph>
      </Flex>

      {isLoading && (
        <Flex justifyContent="center" padding={32}>
          <ProgressCircle />
        </Flex>
      )}

      {error && (
        <Flex
          alignItems="center"
          gap={8}
          padding={16}
          style={{ color: Colors.Text.Critical.Default }}
        >
          <CriticalIcon />
          <Paragraph>{error.message}</Paragraph>
        </Flex>
      )}

      {data?.records && !isLoading && (
        <Flex flexDirection="column" gap={16} style={{ width: "100%", maxWidth: 1200 }}>
          <Flex
            flexDirection="row"
            gap={16}
            padding={16}
            style={{
              fontWeight: "bold",
              borderBottom: `2px solid ${Colors.Border.Neutral.Default}`,
            }}
          >
            <div style={{ flex: "0 0 200px" }}>Timestamp</div>
            <div style={{ flex: "0 0 100px" }}>Status</div>
            <div style={{ flex: "1" }}>Content</div>
          </Flex>
          {data.records.map((record: any, index: number) => (
            <Flex
              key={index}
              flexDirection="row"
              gap={16}
              padding={16}
              style={{
                borderBottom: `1px solid ${Colors.Border.Neutral.Default}`,
                backgroundColor: Colors.Background.Container.Default,
              }}
            >
              <div style={{ flex: "0 0 200px" }}>
                {record.timestamp
                  ? new Date(record.timestamp).toLocaleString()
                  : ""}
              </div>
              <div style={{ flex: "0 0 100px" }}>{record.status || ""}</div>
              <div style={{ flex: "1", wordBreak: "break-word" }}>
                {record.content || ""}
              </div>
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
};
