import cn from 'classnames';

import styles from '@/modules/Reports/components/MultipleTable/MultipleTable.module.scss';

export default [
    {
        title: 'TC',
        className: cn(styles['right-border'], styles['align-center']),
        children: [
            {
                title: 'Водитель',
                dataIndex: 'driverName',
                ellipsis: true,
            },
            {
                title: 'Вид ТС',
                dataIndex: 'vehicleType',
                ellipsis: true,
                width: 140,
            },
            {
                title: 'Госномер',
                dataIndex: 'vehicleNumberFull',
                ellipsis: true,
                width: 140,
            },
            {
                title: 'Район',
                dataIndex: 'regionName',
                ellipsis: true,
                width: 200,
                className: styles['right-border'],
            },
        ],
    },
    {
        title: 'Контейнерные площадки',
        className: cn(styles['right-border'], styles['align-center']),
        children: [
            {
                title: 'План',
                dataIndex: 'containerAreasPlan',
                width: 70,
                ellipsis: true,
                align: 'right',
            },
            {
                title: 'Факт',
                dataIndex: 'containerAreasFact',
                width: 70,
                ellipsis: true,
                align: 'right',
            },
            {
                title: 'Пусто',
                dataIndex: 'containerAreasEmpty',
                width: 70,
                ellipsis: true,
                align: 'right',
            },
            {
                title: 'Невывоз',
                dataIndex: 'containerAreasNotRemoved',
                width: 100,
                ellipsis: true,
                align: 'right',
            },
            {
                title: 'Выполнение',
                dataIndex: 'containerAreasPercentageOfCompletion',
                width: 120,
                ellipsis: true,
                align: 'right',
                render: (value: any) => `${parseFloat(value).toFixed(2)}%`,
                className: styles['right-border'],
            },
        ],
    },
    {
        title: 'Контейнера',
        className: styles['align-center'],
        children: [
            {
                title: 'План',
                dataIndex: 'containersPlan',
                width: 70,
                ellipsis: true,
                align: 'right',
            },
            {
                title: 'Факт',
                dataIndex: 'containersFact',
                width: 70,
                ellipsis: true,
                align: 'right',
            },
            {
                title: 'Пусто',
                dataIndex: 'containersEmpty',
                width: 70,
                ellipsis: true,
                align: 'right',
            },
            {
                title: 'Невывоз',
                dataIndex: 'containersNotRemoved',
                width: 100,
                ellipsis: true,
                align: 'right',
            },
            {
                title: 'Выполнение',
                dataIndex: 'containersPercentageOfCompletion',
                width: 120,
                ellipsis: true,
                align: 'right',
                render: (value: any) => `${parseFloat(value).toFixed(2)}%`,
            },
        ],
    },
];
