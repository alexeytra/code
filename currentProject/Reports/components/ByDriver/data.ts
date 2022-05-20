const rows: any[] = [];
const cells: any[] = [];

for (let i = 0; i < 10; i += 1) {
    cells.push({
        key: i,
        id: i,
        driverName: `Имя водителя-${i}`,
        number: `Госномер-${i}`,
        vehicleType: `Вид ТС-${i}`,
        region: `Район-${i}`,
        containerAreasPlan: i,
        containerAreasFact: i,
        containerAreasEmpty: i,
        containerAreasNotRemoved: i,
        containerAreasPercentageOfCompletion: i,
        containersPlan: i,
        containersFact: i,
        containersEmpty: i,
        containersNotRemoved: i,
        containersPercentageOfCompletion: i,
    });
}

for (let i = 0; i < 3; i += 1) {
    rows.push({
        groupTitle: `Иркутск-${i}`,
        summary: {
            containerAreasPlan: 99,
            containerAreasFact: 22,
            containerAreasEmpty: 25,
            containerAreasNotRemoved: 23,
            containerAreasPercentageOfCompletion: 25,
            containersPlan: 99,
            containersFact: 22,
            containersEmpty: 25,
            containersNotRemoved: 23,
            containersPercentageOfCompletion: 25,
        },
        cells,
    });
}

export default {
    title: 'Отчет по вывозу',
    summary: {
        containerAreasPlan: 9994,
        containerAreasFact: 224,
        containerAreasEmpty: 2554,
        containerAreasNotRemoved: 2334,
        containerAreasPercentageOfCompletion: 254,
        containersPlan: 994,
        containersFact: 224,
        containersEmpty: 255,
        containersNotRemoved: 233287,
        containersPercentageOfCompletion: 254,
    },
    rows: [
        {
            groupTitle: 'Иркутский район',
            rows,
            summary: {
                containerAreasPlan: 99,
                containerAreasFact: 22,
                containerAreasEmpty: 25,
                containerAreasNotRemoved: 23,
                containerAreasPercentageOfCompletion: 25,
                containersPlan: 99,
                containersFact: 22,
                containersEmpty: 25,
                containersNotRemoved: 23,
                containersPercentageOfCompletion: 25,
            },
        },
        {
            groupTitle: 'Ленинский район',
            rows,
            summary: {
                containerAreasPlan: 99,
                containerAreasFact: 22,
                containerAreasEmpty: 25,
                containerAreasNotRemoved: 23,
                containerAreasPercentageOfCompletion: 25,
                containersPlan: 99,
                containersFact: 22,
                containersEmpty: 25,
                containersNotRemoved: 23,
                containersPercentageOfCompletion: 25,
            },
        },
        {
            groupTitle: 'Октябрьский район',
            rows,
            summary: {
                containerAreasPlan: 99,
                containerAreasFact: 22,
                containerAreasEmpty: 25,
                containerAreasNotRemoved: 23,
                containerAreasPercentageOfCompletion: 25,
                containersPlan: 99,
                containersFact: 22,
                containersEmpty: 25,
                containersNotRemoved: 23,
                containersPercentageOfCompletion: 25,
            },
        },
    ],
};
