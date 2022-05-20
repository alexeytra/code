import styles from '@/modules/Reports/components/MultipleTable/MultipleTable.module.scss';

export const summaryColumnsSingleDate = [
    {
        index: 0,
        colSpan: 3,
        text: 'Итого:',
    },
    {
        index: 3,
        key: 'countProblems',
        className: styles['align-center'],
    },
];
