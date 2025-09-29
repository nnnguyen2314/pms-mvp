import { gql } from '@apollo/client';

export const QUERY_TASKS = gql`
  query Tasks($workspaceId: ID!) {
    tasks(workspaceId: $workspaceId) {
      id
      title
      status
      assigneeId
      updatedAt
    }
  }
`;
