import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Radio, RadioChangeEvent, Space, TreeSelect, Typography } from 'antd';

import { ReportsHeader } from '@/modules/Reports/components/ReportsHeader';
import styles from '@/modules/Reports/components/PlanFail/PlanFail.module.scss';
import { REGION_FULL_FRAGMENT, useQuery } from '@/models';
import { orderBy } from 'lodash';
import { REPORTS } from '@/constants';
import { ReportsBody } from '@/modules/Reports/components/ReportsBody';
import { transformRegionsToTreeData } from '@/helpers';

const { Paragraph } = Typography;
const { REPORTS_TYPES } = REPORTS;

export const Volumes = observer(() => {
    const {
        store: {
            reportsStore: { setCurrentFilter, updateCurrentNewEngineReport, currentFilter },
        },
    } = useQuery();

    const [updateReportMethod, setUpdateReportMethod] = useState<(() => void) | undefined>();

    const { data: regionsData } = useQuery(store => store.queryAvailableRegions(undefined, REGION_FULL_FRAGMENT));

    useEffect(() => {
        setCurrentFilter(REPORTS_TYPES.volumes);
        setUpdateReportMethod(() => updateCurrentNewEngineReport);
        updateCurrentNewEngineReport();
    }, []);

    const renderAmount = () => (
        <Space size={25} align="center" style={{ marginTop: 10 }}>
            <Paragraph>Единица измерения:</Paragraph>
            <Radio.Group
                name="valueType"
                onChange={(e: RadioChangeEvent) => {
                    localStorage.setItem('valueType', e.target.value);
                    currentFilter.update({
                        ...currentFilter,
                        valueType: e.target.value,
                    });
                    updateCurrentNewEngineReport();
                }}
                defaultValue={currentFilter.valueType}
            >
                <Radio value="VOLUME">Кубометры</Radio>
                <Radio value="AMOUNT">Контейнеры</Radio>
            </Radio.Group>
        </Space>
    );

    const onTreeSelectChange = (val: string) => {
        localStorage.setItem('regionIdVolume', val);
        currentFilter.update({ regionIdVolume: val });
        updateCurrentNewEngineReport();
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
                hasCarrierFilter
                hasCarriersFilter
                updateReportMethod={updateReportMethod}
                exportReportName={REPORTS_TYPES.volumes}
                periods={['day', 'week', 'month']}
            >
                <Space size="small">
                    <Paragraph>Участок:</Paragraph>
                    {regionsData?.availableRegions && (
                        <TreeSelect
                            className={styles['select-region']}
                            placeholder="Не задан"
                            defaultValue={localStorage.getItem('regionIdVolume') || (regionsTreeData[0].key as string)}
                            onChange={onTreeSelectChange}
                            showSearch
                            treeNodeFilterProp="title"
                            treeData={regionsTreeData}
                        />
                    )}
                </Space>
            </ReportsHeader>

            {renderAmount()}

            <ReportsBody fullWidth tableLayout="fixed" />
        </div>
    );
});
