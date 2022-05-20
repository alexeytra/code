import React from 'react';
import { observer } from 'mobx-react';

import MultipleTable from '@/modules/Reports/components/MultipleTable';

import { useRootStore } from '@/store';
import columns from './columns';
import summaryColumns from './summaryColumns';

export const ByDriver = observer(() => {
    const {
        reportsStore: { currentReport, isLoading },
    } = useRootStore();

    return (
        <MultipleTable report={currentReport} columns={columns} summaryColumns={summaryColumns} isLoading={isLoading} />
    );
});
