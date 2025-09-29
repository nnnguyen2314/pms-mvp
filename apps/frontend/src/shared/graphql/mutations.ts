import { gql } from '@apollo/client';

export const MUTATION_UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: TaskUpdateInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      status
      assigneeId
      updatedAt
    }
  }
`;
