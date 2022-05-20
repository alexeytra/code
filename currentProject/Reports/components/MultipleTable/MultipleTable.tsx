import React from 'react';
import { toJS } from 'mobx';
import { Table, Typography, Empty, Space, Spin, Row, Col } from 'antd';
import cn from 'classnames';

// import { ReportResultDTO } from '@/cuba/entities/dispatching_ReportResultDTO';
import { ReportRowDTO } from '@/cuba/entities/dispatching_ReportRowDTO';
import { ReportsService } from '@/services';

import { IReportModel } from '@/stores/ReportsStore/models/ReportModel';

import styles from './MultipleTable.module.scss';

interface ISummaryColumn {
    index: number;
    text?: string;
    className?: string;
    key?: string;
    postfix?: string;
    colSpan?: number;
}

interface IProps {
    report: IReportModel | null;
    columns: any;
    summaryColumns: ISummaryColumn[];
    isLoading?: boolean;
}

function getHeaderDataSource(data: any) {
    if (data?.cells) {
        return ReportsService.transformReportsData(data.cells);
    }

    if (data?.rows) {
        getHeaderDataSource(data.rows[0]);
    } else {
        return [];
    }
}

const MultipleTable = ({ report, columns, summaryColumns, isLoading }: IProps) => {
    const renderSummary = (summary: any) => {
        return (
            <Table.Summary.Row>
                {summaryColumns.map(({ colSpan, text, key, index, className, postfix }: ISummaryColumn) => {
                    const summaryValue = postfix === '%' ? parseFloat(summary[key!]).toFixed(2) : summary[key!];

                    return (
                        <Table.Summary.Cell
                            key={index}
                            index={index}
                            colSpan={colSpan}
                            className={cn(className, {
                                [styles['align-right']]: index !== 0,
                            })}
                        >
                            <Typography.Text strong className={styles['table-title']}>
                                {text || `${summaryValue}${postfix || ''}`}
                            </Typography.Text>
                        </Table.Summary.Cell>
                    );
                })}
            </Table.Summary.Row>
        );
    };

    const renderStandaloneSummary = (summary: any) => {
        return (
            <Table
                dataSource={getHeaderDataSource(toJS(report))}
                columns={columns}
                className={styles['hidden-body']}
                pagination={{ pageSize: 400, hideOnSinglePage: true }}
                showHeader={false}
                summary={() => renderSummary(summary)}
            />
        );
    };

    const renderTable = (row: any) => {
        const { cells, groupTitle, summary } = row;

        return (
            <Table
                title={() => (
                    <Typography.Text strong className={styles['table-title']}>
                        {groupTitle}
                    </Typography.Text>
                )}
                dataSource={ReportsService.transformReportsData(cells)}
                key={groupTitle}
                columns={columns}
                showHeader={false}
                pagination={{ pageSize: 400, hideOnSinglePage: true }}
                className={cn(!cells && styles['hidden-body'])}
                summary={() => summary && renderSummary(summary)}
            />
        );
    };

    const renderTree = (rows: any): any => {
        return rows.map((row: ReportRowDTO) => {
            // @ts-ignore
            if (!row.cells?.length > 0 && !row.rows?.length > 0) {
                return null;
            }

            return (
                <Row key={row.groupTitle}>
                    <Col>
                        {row.cells ? (
                            <Row>
                                <Col>{renderTable(row)}</Col>
                            </Row>
                        ) : (
                            <>
                                <Row>
                                    <Col>
                                        <Typography.Text strong className={styles['table-title']}>
                                            {row.groupTitle}
                                        </Typography.Text>
                                    </Col>
                                </Row>

                                {row.rows && renderTree(row.rows)}
                                {row.summary && renderStandaloneSummary(row.summary)}
                            </>
                        )}
                    </Col>
                </Row>
            );
        });
    };

    const hasData = report?.rows.some((row: any) => row?.cells?.length > 0 || row?.rows?.length > 0 || false);

    return (
        <div className={styles['container']}>
            {isLoading && (
                <Space className={styles['space']} direction="vertical" align="center">
                    <Spin size="large" />
                </Space>
            )}

            {!isLoading && (!report || !hasData) && (
                <Space className={styles['space']} direction="vertical" align="center">
                    <Empty />
                </Space>
            )}

            {report && !isLoading && hasData && (
                <>
                    <Table
                        dataSource={getHeaderDataSource(toJS(report))}
                        columns={columns}
                        sticky
                        className={cn(styles['table-head'], styles['hidden-body'])}
                        pagination={{ pageSize: 400, hideOnSinglePage: true }}
                    />
                    {renderTree(toJS(report.rows))}
                    {report.summary && renderStandaloneSummary(report.summary)}
                </>
            )}
        </div>
    );
};

export default MultipleTable;
