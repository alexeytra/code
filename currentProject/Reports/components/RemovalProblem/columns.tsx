import React from 'react';
import styles from '@/modules/Reports/components/MultipleTable/MultipleTable.module.scss';

export const columnsSingleDate = [
    {
        title: 'Код КП',
        dataIndex: 'containerCode',
    },
    {
        title: 'Площадка',
        dataIndex: 'addressView',
        ellipsis: true,
    },
    {
        title: 'Контрагент',
        dataIndex: 'companyName',
        ellipsis: false,
    },
    {
        title: 'Проблема',
        dataIndex: 'problem',
        ellipsis: false,
    },
];

export const columnsMultipleDate = [
    {
        title: 'Код КП',
        dataIndex: 'containerCode',
    },
    {
        title: 'Площадка',
        dataIndex: 'addressView',
        ellipsis: true,
    },
    {
        title: 'Контрагент',
        dataIndex: 'companyName',
        ellipsis: false,
    },
    {
        title: <div className={styles['align-center']}>Количество</div>,
        dataIndex: 'countProblems',
        ellipsis: true,
        className: styles['align-center'],
    },
];
