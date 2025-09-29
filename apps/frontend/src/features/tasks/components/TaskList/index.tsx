"use client";

import React from 'react';
import LegacyTaskList from '@/components/tasks/TaskList';
import type { Task } from '@/shared/types/task';

export default function TaskList({ tasks }: { tasks: Task[] }) {
  return <LegacyTaskList tasks={tasks} />;
}
