import styles from '@/modules/Reports/components/MultipleTable/MultipleTable.module.scss';

export default [
    {
        index: 0,
        colSpan: 4,
        text: 'Итого:',
        className: styles['right-border'],
    },
    {
        index: 4,
        key: 'containerAreasPlan',
    },
    {
        index: 5,
        key: 'containerAreasFact',
    },
    {
        index: 6,
        key: 'containerAreasEmpty',
    },
    {
        index: 7,
        key: 'containerAreasNotRemoved',
    },
    {
        index: 8,
        key: 'containerAreasPercentageOfCompletion',
        className: styles['right-border'],
        postfix: '%',
    },
    {
        index: 9,
        key: 'containersPlan',
    },
    {
        index: 10,
        key: 'containersFact',
    },
    {
        index: 11,
        key: 'containersEmpty',
    },
    {
        index: 12,
        key: 'containersNotRemoved',
    },
    {
        index: 13,
        key: 'containersPercentageOfCompletion',
        postfix: '%',
    },
];
