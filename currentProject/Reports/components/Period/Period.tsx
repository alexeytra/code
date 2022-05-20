import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action, makeObservable } from 'mobx';
import locale from 'antd/es/date-picker/locale/ru_RU';
import { PERIOD } from '@/constants';
import { Tabs, DatePicker, Space, Menu, Dropdown, Button } from 'antd';
import cn from 'classnames';
import dayjs from 'dayjs';

import { BasicComponentProps, AppStoreInjected } from '@/cuba/BasicComponentProps';

import { ReportDatesMode } from '@/stores/ReportsStore/ReportsStore';
import { injectStore } from '@/store';
import { ReactComponent as ArrowDown } from '@/assets/icons/dropdown-arrow-down.svg';
import presets from './config';
import styles from './Period.module.scss';

const { RangePicker } = DatePicker;
const { day: DAY, week: WEEK, month: MONTH, year: YEAR } = PERIOD.PERIOD_NAMES;
const { TabPane } = Tabs;

type Picker = 'week' | 'month' | 'year' | 'time' | 'date' | 'quarter' | undefined;

interface Props extends BasicComponentProps, AppStoreInjected {
    short?: boolean;
    oneDay?: boolean;
    periods?: string[];
    onChangeDate: (dates: [dayjs.Dayjs, dayjs.Dayjs], mode: ReportDatesMode) => void;
    onOpenChange: (isRangePickerOpen: boolean) => void;
    isRangePickerOpen: boolean;
}

@injectStore
@observer
class Period extends Component<Props> {
    rangePicker: any;

    dateFormats = {
        day: 'DD.MM.YYYY',
        week: 'wo-YYYY',
        month: 'M.YYYY',
        year: 'YYYY',
    };

    presets = presets;

    presetKey?: string;

    period = DAY;

    dates = {
        day: {
            from: null,
            to: null,
        },
        week: {
            from: null,
            to: null,
        },
        month: {
            from: null,
            to: null,
        },
        year: {
            from: null,
            to: null,
        },
    };

    dateFrom: null | dayjs.Dayjs;

    dateTo: null | dayjs.Dayjs;

    constructor(props: Props) {
        super(props);

        makeObservable(this, {
            presetKey: observable,
            period: observable,
            dates: observable.deep,
            dateFrom: observable,
            dateTo: observable,
            setDates: action,
            onChangeTab: action,
            handleMenuClick: action,
        });

        this.rangePicker = React.createRef();

        const [from, to] = props.rootStore!.reportsStore.currentFilter.dates;

        this.setDates(from, to!);
    }

    disabledDate = (currentDate: dayjs.Dayjs) => {
        return currentDate && currentDate > dayjs();
    };

    onChangeRangePicker = (dates: [any, any], rangePickerType: ReportDatesMode) => {
        const { onChangeDate } = this.props;
        if (dates) {
            const dateFrom: dayjs.Dayjs = dates[0];
            let dateTo: dayjs.Dayjs = dates[1];

            if (this.props.short && dateTo) {
                if (this.period === 'day' && dateTo.diff(dateFrom, 'day') > 31) {
                    dateTo = dateFrom.add(31, 'day');
                } else if (this.period === 'month' && dateTo.diff(dateFrom, 'month') > 0) {
                    dateTo = dateFrom;
                }
            }
            this.setDates(dateFrom as dayjs.Dayjs, dateTo as dayjs.Dayjs);
            onChangeDate([dateFrom, dateTo], rangePickerType as ReportDatesMode);
        } else {
            this.setDates(null, null);
        }
    };

    onChangeDatePicker = (date: any) => {
        const { onChangeDate } = this.props;
        const dateFrom: dayjs.Dayjs = date;
        if (date) {
            this.setDates(dateFrom, null);
            onChangeDate([dateFrom, dayjs()], DAY as ReportDatesMode);
        }
    };

    renderDatePicker = () => {
        const { onOpenChange, isRangePickerOpen, oneDay } = this.props;

        const { from, to } = this.dates[this.period];

        let rangePickerType = DAY;

        let format = this.dateFormats[DAY];

        let onOk;

        let picker = 'date' as Picker;

        switch (this.period) {
            case DAY:
                onOk = () => {
                    onOpenChange(false);
                };

                break;
            case WEEK:
                format = (value: dayjs.Dayjs): string => {
                    return `${value.format(this.dateFormats[WEEK])}`;
                };

                picker = WEEK as Picker;

                rangePickerType = WEEK as ReportDatesMode;

                break;
            case MONTH:
                format = (value: dayjs.Dayjs): string => {
                    return `${value.format(this.dateFormats[MONTH])}`;
                };

                picker = MONTH as Picker;

                rangePickerType = MONTH as ReportDatesMode;

                break;
            case YEAR:
                format = (value: dayjs.Dayjs): string => {
                    return `${value.format(this.dateFormats[YEAR])}`;
                };

                picker = YEAR as Picker;

                rangePickerType = YEAR as ReportDatesMode;

                break;
            default:
                onOk = () => {
                    onOpenChange(false);
                };

                break;
        }

        if (oneDay) {
            return (
                <DatePicker
                    locale={locale}
                    format={format}
                    value={from}
                    onChange={val => this.onChangeDatePicker(val || dayjs())}
                />
            );
        }

        if (this.period === WEEK) {
            return (
                <RangePicker
                    ref={this.rangePicker}
                    locale={locale}
                    picker={picker}
                    format={format}
                    open={isRangePickerOpen}
                    value={[from, to]}
                    onOpenChange={onOpenChange}
                    disabledDate={this.disabledDate as any}
                    // @ts-ignore
                    onChange={(dates: [any, any]) => this.onChangeRangePicker(dates, rangePickerType)}
                />
            );
        }

        return (
            <RangePicker
                ref={this.rangePicker}
                showTime
                locale={locale}
                picker={picker}
                format={format}
                open={isRangePickerOpen}
                allowEmpty={[false, true]}
                defaultValue={[from, to]}
                value={[from, to]}
                onOk={onOk}
                onOpenChange={onOpenChange}
                disabledDate={this.disabledDate as any}
                // @ts-ignore
                onChange={(dates: [any, any]) => this.onChangeRangePicker(dates, rangePickerType)}
            />
        );
    };

    setDates = (from: null | dayjs.Dayjs, to: null | dayjs.Dayjs) => {
        this.dates[this.period].from = from;

        this.dates[this.period].to = to;
    };

    onChangeTab = (key: ReportDatesMode, preset?: any) => {
        const { onOpenChange, onChangeDate } = this.props;

        this.period = key;

        if (this.dates[this.period].from) {
            if (preset) {
                const { from, to } = this.dates[this.period];
                const { from: presetFrom, to: presetTo } = preset!.dates!;

                if (!from.isSame(presetFrom) && !to.isSame(presetTo)) {
                    onChangeDate([from, to], this.period as ReportDatesMode);
                }
            }
        } else {
            this.rangePicker.current.focus();

            onOpenChange(true);
        }
    };

    handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const { onChangeDate, onOpenChange } = this.props;

        const button = e.currentTarget as HTMLButtonElement;

        const { key } = button.dataset;

        const preset = this.presets.filter((item: any) => {
            return item.key === key;
        })[0];

        const { period, key: presetKey } = preset;

        this.presetKey = presetKey;

        this.onChangeTab(period as ReportDatesMode);

        const { from, to } = preset!.dates!;

        this.setDates(from, to);

        const dates = [from, to];

        onChangeDate(dates as [dayjs.Dayjs, dayjs.Dayjs], this.period as ReportDatesMode);

        onOpenChange(false);
    };

    renderElementMenu = (key: string, title: string) => (
        <Menu.Item key={key}>
            <Button
                type="link"
                data-key={key}
                className={cn([key === this.presetKey ? styles['preset-active'] : ''])}
                onClick={this.handleMenuClick}
            >
                {title}
            </Button>
        </Menu.Item>
    );

    renderPeriodTab = (periodName: string) => {
        const { PERIOD_NAMES, PERIOD_TITLES } = PERIOD;
        return Object.values(PERIOD_NAMES)
            .filter(v => v === periodName)
            .map(tab => <TabPane tab={PERIOD_TITLES[tab]} key={tab} />);
    };

    render() {
        const { PERIOD_NAMES, PERIOD_TITLES } = PERIOD;

        const { periods } = this.props;

        const menu = (
            <Menu>
                {this.presets.map((item: any) => {
                    const { key, title, divider, period } = item;
                    if (!divider) {
                        if (periods?.includes('all')) return this.renderElementMenu(key, title);
                        if (periods?.includes(period)) return this.renderElementMenu(key, title);
                        return null;
                    }
                    if (periods?.includes('week') || periods?.includes('all')) return <Menu.Divider key={key} />;
                    return null;
                })}
            </Menu>
        );

        return (
            <Space className={styles['container']} size="small" align="center" direction="horizontal">
                <Tabs
                    className={styles['tabs']}
                    activeKey={this.period}
                    // @ts-ignore
                    onChange={this.onChangeTab}
                    tabBarGutter={20}
                >
                    {periods?.includes('all') &&
                        Object.values(PERIOD_NAMES).map(tab => <TabPane tab={PERIOD_TITLES[tab]} key={tab} />)}

                    {periods?.includes('day') && this.renderPeriodTab(PERIOD_NAMES.day)}
                    {periods?.includes('week') && this.renderPeriodTab(PERIOD_NAMES.week)}
                    {periods?.includes('month') && this.renderPeriodTab(PERIOD_NAMES.month)}
                    {periods?.includes('year') && this.renderPeriodTab(PERIOD_NAMES.year)}
                </Tabs>

                {this.renderDatePicker()}

                <Dropdown
                    overlay={menu}
                    trigger={['click']}
                    placement="bottomRight"
                    arrow
                    overlayClassName={styles['dropdown']}
                >
                    <Button type="link">
                        <ArrowDown />
                    </Button>
                </Dropdown>
            </Space>
        );
    }
}

export default Period;
