/* eslint-disable react/no-danger */
import React from 'react';
import { observer } from 'mobx-react';
import { Spin } from 'antd';

import { useQuery } from '@/models';
import styles from './ReportsBody.module.scss';
import Lightbox from '@/components/common/Lightbox';

interface Props {
    width?: number;
    gap?: number;
    fullWidth?: boolean;
    tableLayout?: string;
}

export const ReportsBody = observer(({ fullWidth, tableLayout = 'auto', width, gap }: Props) => {
    const {
        store: {
            reportsStore: { isLoading, isHTMLLoading, currentNewEngineReport },
        },
    } = useQuery();

    const isDataLoading = isLoading || isHTMLLoading;

    const handleReportBodyHTML = (): string => {
        if (!currentNewEngineReport || !currentNewEngineReport.html) {
            return '';
        }
        if (currentNewEngineReport.html.style) {
            const styleTags = Array.from(document.getElementsByTagName('style'));
            const newEngineStyle = styleTags.find(element => element.title === 'newEngineReport');
            if (!newEngineStyle) {
                const styleElement = document.createElement('style');
                styleElement.title = 'newEngineReport';
                styleElement.innerHTML = currentNewEngineReport.html.style;
                document.head.appendChild(styleElement);
            } else {
                newEngineStyle.innerHTML = currentNewEngineReport.html.style;
            }
        }
        const reportWrapper = document.createElement('div');
        reportWrapper.innerHTML = currentNewEngineReport.html.body;
        const table = reportWrapper?.getElementsByTagName('table');
        if (!table || !table.length) {
            return '';
        }
        let currentWidth: string = '';
        if (fullWidth) currentWidth = 'width: 100%;';
        if (width) currentWidth = `width: ${width}px;`;
        table[0].setAttribute('style', `${currentWidth} table-layout: ${tableLayout}`);
        return reportWrapper.innerHTML;
    };

    return (
        <Spin className={styles['spin']} wrapperClassName={styles['wrapper']} size="large" spinning={isDataLoading}>
            <Lightbox className={styles['photos']}>
                <div
                    className={styles['container']}
                    style={{ marginTop: `${gap}px` }}
                    dangerouslySetInnerHTML={{ __html: handleReportBodyHTML() }}
                />
            </Lightbox>
        </Spin>
    );
});
