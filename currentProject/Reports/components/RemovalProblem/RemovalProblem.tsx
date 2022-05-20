import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Space, TreeSelect, Typography } from 'antd';

import MultipleTable from '@/modules/Reports/components/MultipleTable';
import { ReportsHeader } from '@/modules/Reports/components/ReportsHeader';

import { columnsSingleDate, columnsMultipleDate } from './columns';

import { REGION_FULL_FRAGMENT, useQuery } from '@/models';
import { REPORTS } from '@/constants';
import { summaryColumnsSingleDate } from './summaryColumns';
import styles from './RemovalProblem.module.scss';
import { transformRegionsToTreeData } from '@/helpers';
import { orderBy } from 'lodash';

const { Paragraph } = Typography;
const { REPORTS_TYPES } = REPORTS;

export const RemovalProblem = observer(() => {
    const {
        store: {
            reportsStore: { setCurrentFilter, currentReport, currentFilter, isLoading, updateCurrentReport },
        },
    } = useQuery();

    const [updateReportMethod, setUpdateReportMethod] = useState<(() => void) | undefined>();

    const { data: regionsData } = useQuery(store => store.queryAvailableRegions(undefined, REGION_FULL_FRAGMENT));

    useEffect(() => {
        setCurrentFilter(REPORTS_TYPES.removalProblem);
        updateCurrentReport();
        setUpdateReportMethod(() => updateCurrentReport);
    }, []);

    const onTreeSelectChange = (val: string) => {
        localStorage.setItem('regionIdRemovalProblem', val);
        currentFilter.update({ regionIdRemovalProblem: val });
        updateCurrentReport();
    };

    const regionsTreeData = orderBy(
        transformRegionsToTreeData({
            regions: regionsData?.availableRegions,
        }),
        ['title'],
        ['asc'],
    );

    return (
        <div className={styles['container']}>
            <ReportsHeader
                updateReportMethod={updateReportMethod}
                exportReportName={REPORTS.REPORTS_TYPES.problemWithContainerSummaryReport}
                periods={['all']}
            >
                <Space size="small">
                    <Paragraph>Участок:</Paragraph>
                    {regionsData?.availableRegions && (
                        <TreeSelect
                            className={styles['select-region']}
                            placeholder="Не задан"
                            defaultValue={
                                localStorage.getItem('regionIdRemovalProblem') || (regionsTreeData[0].key as string)
                            }
                            onChange={onTreeSelectChange}
                            showSearch
                            treeNodeFilterProp="title"
                            treeData={regionsTreeData}
                        />
                    )}
                </Space>
            </ReportsHeader>

            <MultipleTable
                report={currentReport}
                columns={currentReport?.datesMode === 'single' ? columnsSingleDate : columnsMultipleDate}
                summaryColumns={currentReport?.datesMode === 'single' ? summaryColumnsSingleDate : []}
                isLoading={isLoading}
            />
        </div>
    );
});
