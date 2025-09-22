interface JiraIssue {
  id: string;
  key: string;
  self: string;
  fields: {
    issuetype: {
      name: string;
    };
    status: {
      name: string;
    };
    summary: string;
    description: string;
    assignee: {
      name: string;
    };
  };
}

export default JiraIssue;
