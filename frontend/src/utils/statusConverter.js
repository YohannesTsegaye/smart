// Status mapping - using exact values that backend expects
export const STATUS_MAPPING = {
  "Under Review": "Under Review",
  Received: "Received",
  Accepted: "Accepted",
  Rejected: "Rejected",
  Interview: "Interview",
  "Call for exam": "Call for exam",
};

export const convertStatus = (frontendStatus) => {
  return STATUS_MAPPING[frontendStatus] || frontendStatus;
};
