import React, { ReactNode, useRef, useState } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Space, Button, Row, Col, Form, Menu, Dropdown, Select, message, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import dayjs, { OpUnitType } from 'dayjs';

import { PLAN_FACT, REPORTS, ReportExportTypes, TRANSPORT } from '@/constants';
import { useQuery, CompanyModelType } from '@/models';

import Period from '@/modules/Reports/components/Period';
import { ReactComponent as PDFIcon } from '@/assets/icons/pdf.svg';
import { ReactComponent as ExcelIcon } from '@/assets/icons/microsoft-excel.svg';
import { ReactComponent as SheetsIcon } from '@/assets/icons/google-spreadsheet.svg';
import { ReactComponent as YTableIcon } from '@/assets/icons/yandex-table.svg';

import styles from './ReportsHeader.module.scss';

interface Props {
    children: ReactNode;
    periods?: string[];
    oneDay?: boolean;

    updateReportMethod?(): void;

    exportReportName?: string;
    hasCarrierFilter?: boolean;
    hasCarriersFilter?: boolean;
}

const { Option } = Select;
const { Text } = Typography;

const exportMessageKey = 'exportReport';
const { PLAN_FACT_REPORT_NAME } = PLAN_FACT;
const { EXPORT_TYPES } = REPORTS;
const { TRANSPORT_REPORT_NAME } = TRANSPORT;

export const ReportsHeader = observer(
    ({
        updateReportMethod,
        children,
        exportReportName,
        hasCarrierFilter,
        hasCarriersFilter,
        periods,
        oneDay,
    }: Props) => {
        const formRef = useRef(null);
        const [isRangePickerOpen, setIsRangePickerOpen] = useState<boolean>(false);
        const exportWithNewEngine = new Set<string>([
            PLAN_FACT_REPORT_NAME.byDriver,
            PLAN_FACT_REPORT_NAME.byArea,
            REPORTS.REPORTS_TYPES.problemWithContainerSummaryReport,
            REPORTS.REPORTS_TYPES.volumes,
            TRANSPORT_REPORT_NAME.inOut,
            PLAN_FACT_REPORT_NAME.vehicleSummary,
            PLAN_FACT_REPORT_NAME.byAreaWithCodes,
        ]);

        const {
            store: {
                userStore: { user },
                appStore: { currentCarrier },
                reportsStore: {
                    byArea: { containerArea },
                    currentFilter,
                    isExportLoading,
                    setCurrentReportDates,
                    exportReport,
                    exportReportWithNewEngine,
                },
            },
        } = useQuery();

        /* useEffect(() => {
            const planFact =
                currentFilter.name === PLAN_FACT_REPORT_NAME.byDriver ||
                currentFilter.name === PLAN_FACT_REPORT_NAME.byArea;

            if (updateReportMethod && planFact) {
                updateReportMethod();
            }
        }, [updateReportMethod, containerArea]); */

        const onChangeDate = (dates: [dayjs.Dayjs, dayjs.Dayjs], mode: OpUnitType = 'day') => {
            if (dates) {
                const [dateFrom] = dates;

                let dateTo = dates[1];

                if (!dateTo) {
                    dateTo = dateFrom.clone();
                }

                setCurrentReportDates([dateFrom.startOf(mode), dateTo.endOf(mode)]);
                if (updateReportMethod) {
                    // Чтобы не появлялись ошибки
                    // при невыбранной КП и смене дат в пикере
                    // if (exportReportName === PLAN_FACT_REPORT_NAME.byArea && !containerArea?.id) {
                    //     return;
                    // }
                    updateReportMethod();
                }
            }
        };

        const onExportClick =
            (exportTo: ReportExportTypes, saveInGoogleDrive: boolean = false, saveOnYandexDisk: boolean = false) =>
            () => {
                if (exportReportName) {
                    if (exportWithNewEngine.has(exportReportName)) {
                        exportReportWithNewEngine(exportReportName, exportTo, exportMessageKey);
                    } else {
                        exportReport(exportReportName, exportMessageKey, saveInGoogleDrive, saveOnYandexDisk);
                    }
                    message.loading({
                        key: exportMessageKey,
                        content: `Производится экспорт в ${exportTo}`,
                        duration: 0,
                    });
                }
            };

        const onFormChange = (changedValues: any, allValues: any) => {
            if (!hasCarriersFilter) {
                currentFilter.update({ ...currentFilter, carrierId: allValues.carrierId });
                if (updateReportMethod) {
                    updateReportMethod();
                }
            } else {
                const carrierIds = allValues.carrierId !== '' ? [allValues.carrierId] : [];
                currentFilter.update({
                    ...currentFilter,
                    carrierIds,
                });
                const notEmptyCarrierRegions =
                    currentFilter.carrierIds.length !== 0 || currentFilter.regionIds.length !== 0;
                if (updateReportMethod && notEmptyCarrierRegions) {
                    updateReportMethod();
                }
            }
        };

        const menu = (
            <Menu>
                {exportReportName && exportWithNewEngine.has(exportReportName) && (
                    <Menu.Item
                        key="exportPDF"
                        onClick={onExportClick(EXPORT_TYPES.pdf as ReportExportTypes)}
                        icon={<PDFIcon />}
                    >
                        В PDF
                    </Menu.Item>
                )}
                <Menu.Item
                    key="exportExcel"
                    onClick={onExportClick(EXPORT_TYPES.excel as ReportExportTypes)}
                    icon={<ExcelIcon />}
                >
                    В Excel
                </Menu.Item>
                <Menu.Item
                    key="exportGoogleSheets"
                    onClick={onExportClick(EXPORT_TYPES.googleSheets as ReportExportTypes, true)}
                    icon={<SheetsIcon />}
                >
                    В Google Sheets
                </Menu.Item>
                <Menu.Item
                    key="YTable"
                    onClick={onExportClick(EXPORT_TYPES.yandexTable as ReportExportTypes, false, true)}
                    icon={<YTableIcon />}
                >
                    В Яндекс Таблицы
                </Menu.Item>
            </Menu>
        );

        const disabledExportByArea = exportReportName === PLAN_FACT.PLAN_FACT_KEYS.byArea && !containerArea;

        return (
            <Row align="middle" justify="space-between" wrap={false}>
                <Col>
                    <Form ref={formRef} initialValues={toJS(currentFilter)} onValuesChange={onFormChange}>
                        <Space size="middle" className={styles['space']}>
                            {hasCarrierFilter && user.carriers.length && (
                                <Form.Item name="carrierId" style={{ marginBottom: 0 }}>
                                    {user?.carriers?.length > 1 ? (
                                        <Select style={{ width: 200 }}>
                                            <Option key="all" value="">
                                                Все перевозчики
                                            </Option>
                                            {user.carriers.map((item: CompanyModelType) => (
                                                <Option key={item.id} value={item.id}>
                                                    {item.fullName}
                                                </Option>
                                            ))}
                                        </Select>
                                    ) : (
                                        <Text>{currentCarrier?.fullName}</Text>
                                    )}
                                </Form.Item>
                            )}

                            {children}
                            <Period
                                periods={periods}
                                short={REPORTS.REPORTS_TYPES.volumes === exportReportName}
                                onChangeDate={onChangeDate}
                                onOpenChange={setIsRangePickerOpen}
                                isRangePickerOpen={isRangePickerOpen}
                                oneDay={oneDay}
                            />
                        </Space>
                    </Form>
                </Col>

                {exportReportName && (
                    <Col>
                        <Dropdown
                            overlay={menu}
                            overlayClassName={styles['dropdown']}
                            trigger={['hover']}
                            placement="bottomRight"
                            disabled={isExportLoading || disabledExportByArea}
                        >
                            <Button type="text">
                                Экспорт
                                <DownOutlined />
                            </Button>
                        </Dropdown>
                    </Col>
                )}
            </Row>
        );
    },
);
