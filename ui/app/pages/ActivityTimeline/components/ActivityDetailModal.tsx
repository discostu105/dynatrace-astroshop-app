import React, { useEffect, useRef } from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Button } from "@dynatrace/strato-components/buttons";
import { Text, Strong, Heading } from "@dynatrace/strato-components/typography";
import type { Activity } from "../ActivityTimeline.const";
import { ACTIVITY_TYPE_LABELS } from "../ActivityTimeline.const";
import { ActivityTypeBadge } from "./ActivityTypeBadge";
import {
  CommitActivityBody,
  CommentActivityBody,
  TaskActivityBody,
  SettingsActivityBody,
  UserActivityBody,
  FileActivityBody,
  BranchActivityBody,
  PRActivityBody,
} from "./ActivityBodies";

interface ActivityDetailModalProps {
  activity: Activity;
  relatedActivities: Activity[];
  onClose: () => void;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getActivityBody = (activity: Activity) => {
  switch (activity.type) {
    case "commit":
      return <CommitActivityBody activity={activity} />;
    case "comment":
      return <CommentActivityBody activity={activity} />;
    case "task":
      return <TaskActivityBody activity={activity} />;
    case "settings":
      return <SettingsActivityBody activity={activity} />;
    case "user":
      return <UserActivityBody activity={activity} />;
    case "file":
      return <FileActivityBody activity={activity} />;
    case "branch":
      return <BranchActivityBody activity={activity} />;
    case "pr":
      return <PRActivityBody activity={activity} />;
    default:
      return null;
  }
};

export const ActivityDetailModal = ({
  activity,
  relatedActivities,
  onClose,
}: ActivityDetailModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    const modal = modalRef.current;
    if (modal) {
      modal.focus();
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === modalRef.current) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("click", handleBackdropClick);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleBackdropClick);
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          maxWidth: "640px",
          width: "90%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "32px",
            height: "32px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "var(--dt-colors-background-neutral)",
            cursor: "pointer",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s",
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "var(--dt-colors-background-neutral-hover)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "var(--dt-colors-background-neutral)";
          }}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Header */}
        <Flex
          flexDirection="column"
          gap={16}
          padding={24}
          style={{
            borderBottom: "1px solid var(--dt-colors-border-neutral-default)",
          }}
        >
          <Flex alignItems="center" gap={12}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--dt-colors-text-default)",
              }}
            >
              {getInitials(activity.userName)}
            </div>
            <Flex flexDirection="column" gap={4} flex={1}>
              <Heading
                level={3}
                id="modal-title"
                style={{ margin: 0, fontSize: "18px" }}
              >
                {activity.userName}
              </Heading>
              <Text
                style={{
                  fontSize: "12px",
                  color: "var(--dt-colors-text-secondary)",
                  margin: 0,
                }}
              >
                {formatTimeAgo(activity.timestamp)}
              </Text>
            </Flex>
            <ActivityTypeBadge type={activity.type} />
          </Flex>
        </Flex>

        {/* Content */}
        <div style={{ padding: "24px" }}>
          <Flex flexDirection="column" gap={24}>
            {/* Activity body */}
            <div>{getActivityBody(activity)}</div>

            {/* Related activities */}
            {relatedActivities.length > 0 && (
              <div>
                <Heading
                  level={4}
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "12px",
                  }}
                >
                  Related Activities from {activity.userName}
                </Heading>
                <Flex flexDirection="column" gap={12}>
                  {relatedActivities.slice(0, 3).map((relActivity) => (
                    <div
                      key={relActivity.id}
                      style={{
                        padding: "12px",
                        borderRadius: "6px",
                        backgroundColor: "var(--dt-colors-background-neutral)",
                        fontSize: "12px",
                        color: "var(--dt-colors-text-secondary)",
                      }}
                    >
                      <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        gap={8}
                      >
                        <Text style={{ margin: 0, flex: 1 }}>
                          <Strong>{relActivity.description}</Strong>
                        </Text>
                        <div style={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                          {formatTimeAgo(relActivity.timestamp)}
                        </div>
                      </Flex>
                    </div>
                  ))}
                </Flex>
              </div>
            )}
          </Flex>
        </div>

        {/* Footer */}
        <Flex
          justifyContent="flex-end"
          gap={12}
          padding={24}
          style={{
            borderTop: "1px solid var(--dt-colors-border-neutral-default)",
          }}
        >
          <Button variant="default" onClick={onClose}>
            Close
          </Button>
        </Flex>
      </div>
    </div>
  );
};
