import { types as t, getParent, Instance } from 'mobx-state-tree';

import { ReportRowDTO } from '@/cuba/entities/dispatching_ReportRowDTO';
import { ReportCellDTO } from '@/cuba/entities/dispatching_ReportCellDTO';

const ReportModel = t
    .model('ReportModel', {
        hash: t.identifier,
        rows: t.array(t.frozen<ReportRowDTO>()),
        summary: t.frozen<ReportCellDTO>(),
        title: t.string,
    })
    .views(self => {
        return {
            get datesMode() {
                const {
                    currentFilter: { dates },
                } = getParent(self, 2);

                const [start, end] = dates;
                const condition = start.isSame(end, 'year') && start.isSame(end, 'month') && start.isSame(end, 'day');

                return condition ? 'single' : 'multiple';
            },
        };
    });

export interface IReportModel extends Instance<typeof ReportModel> {}
export default ReportModel;
