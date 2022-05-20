import dayjs from 'dayjs';

dayjs.locale('ru');

const presets = [
    // За сутки
    {
        period: 'day',
        key: 'today',
        title: 'Сегодня',
        dates: {
            from: dayjs().hour(0).minute(0).second(0),
            to: dayjs().hour(23).minute(59).second(59),
        },
    },
    {
        period: 'day',
        key: 'yesterday',
        title: 'Вчера',
        dates: {
            from: dayjs().subtract(1, 'day').hour(0).minute(0).second(0),
            to: dayjs().subtract(1, 'day').hour(23).minute(59).second(59),
        },
    },
    {
        period: 'day',
        key: 'dby',
        title: 'Позавчера',
        dates: {
            from: dayjs().subtract(2, 'day').hour(0).minute(0).second(0),
            to: dayjs().subtract(2, 'day').hour(23).minute(59).second(59),
        },
    },
    {
        divider: true,
        key: 'dividerDay',
    },
    // За неделю
    {
        period: 'week',
        key: 'thisWeek',
        title: 'Эта неделя',
        dates: {
            from: dayjs().startOf('week').hour(0).minute(0).second(0),
            to: dayjs().endOf('week').hour(23).minute(59).second(59),
        },
    },
    {
        period: 'week',
        key: 'lastWeek',
        title: 'Прошлая неделя',
        dates: {
            from: dayjs().startOf('week').subtract(1, 'week').hour(0).minute(0).second(0),
            to: dayjs().endOf('week').subtract(1, 'week').hour(23).minute(59).second(59),
        },
    },
    {
        divider: true,
        key: 'dividerWeek',
    },
    // За месяц
    {
        period: 'month',
        key: 'thisMonth',
        title: 'Этот месяц',
        dates: {
            from: dayjs().startOf('month').hour(0).minute(0).second(0),
            to: dayjs().endOf('month').hour(23).minute(59).second(59),
        },
    },
    {
        period: 'month',
        key: 'lastMonth',
        title: 'Прошлый месяц',
        dates: {
            from: dayjs().startOf('month').subtract(1, 'month').hour(0).minute(0).second(0),
            to: dayjs().endOf('month').subtract(1, 'month').hour(23).minute(59).second(59),
        },
    },
    {
        divider: true,
        key: 'dividerMonth',
    },
    // За год
    {
        period: 'year',
        key: 'thisYear',
        title: 'Этот год',
        dates: {
            from: dayjs().startOf('year').hour(0).minute(0).second(0),
            to: dayjs().endOf('year').hour(23).minute(59).second(59),
        },
    },
    {
        period: 'year',
        key: 'lastYear',
        title: 'Прошлый год',
        dates: {
            from: dayjs().startOf('year').subtract(1, 'year').hour(0).minute(0).second(0),
            to: dayjs().endOf('year').subtract(1, 'year').hour(23).minute(59).second(59),
        },
    },
];

export default presets;
