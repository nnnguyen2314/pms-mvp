"use client";

import React from 'react';
import type { Task } from '@/shared/types/task';

type Props = { tasks: Task[] };

// Legacy flat list renderer used by features/tasks wrapper
export default function TaskList({ tasks }: Props) {
    if (!Array.isArray(tasks) || tasks.length === 0) {
        return <div>No tasks</div>;
    }

    return (
        <div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {tasks.map((t) => (
                    <li key={t.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                        <span style={{ fontWeight: 600 }}>{t.title}</span>
                        {t.projectName ? (
                            <span style={{ marginLeft: 8, color: '#666' }}>· {t.projectName}</span>
                        ) : null}
                        <span style={{ float: 'right', color: '#888' }}>{t.status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
