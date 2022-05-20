import { types as t, flow, applySnapshot, cast, getRoot, Instance } from 'mobx-state-tree';
import dayjs from 'dayjs';
import objectHash from 'object-hash';
import { message } from 'antd';

import FilterModel from './models/FilterModel';
import ByAreaModel from './models/ByAreaModel';
import ReportModel from './models/ReportModel';

import { Region } from '@/cuba/entities/dsp_Region';

import { ReportsService, RegionsService, AuthService } from '@/services';
import { APP_URL_BASE } from '@/config';
import { REPORTS, PLAN_FACT, ReportExportTypes } from '@/constants';
import {
    ContainerAreaParams,
    ExportToExcelParams,
    ExportToCloudDriveParams,
    FetchReportParams,
    GenerateReportParams,
    RegionCarrierParams,
} from '@/services/ReportsService';
import { downloadDataFromBlob } from '@/helpers';

const { EXPORT_TYPES, REPORTS_TYPES, EXPORT_SERVICES, REPORTS_KEYS } = REPORTS;
const { PLAN_FACT_KEYS } = PLAN_FACT;

// TODO: поменять название и переделать на snapshot
const ReportHTMLModel = t
    .model('ReportHTMLModel', {
        name: t.identifier,
        id: t.optional(t.string, ''),
        hash: t.optional(t.string, ''),
        // html: t.optional(t.model({ style: '', body: '' }), { style: '', body: '' }),
        style: t.optional(t.string, ''),
        body: t.optional(t.string, ''),
    })
    .views(self => {
        return {
            get html() {
                return { style: self.style, body: self.body };
            },
        };
    });
// .actions(self => {
//     return {
//         update(fields: any) {
//             applySnapshot(self, {
//                 // name: self.name,
//                 ...fields,
//             });
//         },
//     };
// });

interface ReportHTMLModelType extends Instance<typeof ReportHTMLModel> {}

export const ReportsStore = t
    .model('ReportsStore', {
        currentReport: t.maybeNull(t.reference(ReportModel)),
        currentFilter: t.optional(t.reference(FilterModel), 'PlanFact'),
        currentReportDates: t.optional(t.array(t.frozen<dayjs.Dayjs>()), [
            dayjs().utc().hour(0).minute(0).second(0),
            dayjs().utc().hour(23).minute(59).second(59),
        ]),
        reports: t.map(ReportModel),
        garbageRegions: t.array(t.frozen<Region>()),
        filters: t.optional(t.map(FilterModel), {
            PlanFact: {
                name: 'PlanFact',
            },
            // PlanFail: {
            //     name: 'FailRemoval',
            // },
            FailRemoval: {
                name: 'FailRemoval',
            },
            // PlanFailSummary: {
            //     name: 'FailRemovalSummary',
            // },
            FailRemovalSummary: {
                name: 'FailRemovalSummary',
            },
            RemovalProblem: {
                name: 'RemovalProblem',
            },
            Transport: {
                name: 'Transport',
            },
            ByDistrict: {
                name: 'ByDistrict',
            },
            PlanFactByContainerArea: {
                name: 'PlanFactByContainerArea',
            },
            Selectively: {
                name: 'Selectively',
            },
            VolumeReport: {
                name: 'VolumeReport',
            },
            VehicleGeoZoneEventReport: {
                name: 'VehicleGeoZoneEventReport',
            },
            VehicleSummary: {
                name: 'VehicleSummary',
            },
            PlanFactByContainerAreas: {
                name: 'PlanFactByContainerAreas',
            },
        }),
        isLoading: false,
        isHTMLLoading: false,
        isExportLoading: false,
        byArea: t.optional(ByAreaModel, {}),
        fetchedReportHash: '',
        containerAreas: t.array(t.number),

        newEngineReports: t.array(ReportHTMLModel),
        currentNewEngineReport: t.maybeNull(t.reference(ReportHTMLModel)),
    })
    .views(self => {
        return {
            get currentReportHash() {
                return objectHash({ ...self.currentFilter, dates: self.currentReportDates });
            },

            getReportId(reportName: string) {
                return self.newEngineReports.find((report: ReportHTMLModelType) => report.name === reportName)?.id;
            },

            get byAreaParameters(): ContainerAreaParams {
                if (!(self.containerAreas.length > 0)) {
                    return {
                        containerAreaId: self.byArea.containerArea?.id,
                        dateFrom: dayjs(self.currentFilter.dates[0]).format(),
                        dateTo: dayjs(self.currentFilter.dates[1]).format(),
                    };
                }
                return {
                    lkCodes: self.containerAreas,
                    dateFrom: dayjs(self.currentFilter.dates[0]).format(),
                    dateTo: dayjs(self.currentFilter.dates[1]).format(),
                };
            },

            get byDriverParameters(): RegionCarrierParams {
                return {
                    regionId: self.currentFilter.currentRegionId,
                    carrierId: self.currentFilter.carrierId,
                    dateFrom: dayjs(self.currentFilter.dates[0]).format(),
                    dateTo: dayjs(self.currentFilter.dates[1]).format(),
                };
            },

            get commonParameters(): RegionCarrierParams {
                return {
                    regionId: self.currentFilter.currentRegionId,
                    carrierId: self.currentFilter.carrierId,
                    dateFrom: dayjs(self.currentFilter.dates[0]).format(),
                    dateTo: dayjs(self.currentFilter.dates[1]).format(),
                };
            },

            get volumesReportParameters(): RegionCarrierParams {
                return {
                    regionIds: [self.currentFilter.regionIdVolume],
                    carrierIds: self.currentFilter.carrierIds,
                    dateFrom: dayjs(self.currentFilter.dates[0]).format(),
                    dateTo: dayjs(self.currentFilter.dates[1]).format(),
                    valueType: self.currentFilter.valueType,
                };
            },

            get failRemovalReportParameters(): RegionCarrierParams {
                return {
                    regionId: self.currentFilter.regionIdPlanFail,
                    carrierId: self.currentFilter.carrierId,
                    dateFrom: dayjs(self.currentFilter.dates[0]).format(),
                    dateTo: dayjs(self.currentFilter.dates[1]).format(),
                };
            },

            get byDatesParameters(): RegionCarrierParams {
                return {
                    regionId: self.currentFilter.regionIdRemovalProblem,
                    carrierId: self.currentFilter.carrierId,
                    dateFrom: dayjs(self.currentFilter.dates[0]).format(),
                    dateTo: dayjs(self.currentFilter.dates[1]).format(),
                };
            },

            get inOutTransportParameters(): RegionCarrierParams {
                const params: RegionCarrierParams = {
                    regionId: self.currentFilter.regionIdTransport,
                    carrierId: self.currentFilter.carrierId,
                    dateFrom: dayjs(self.currentFilter.dates[0]).format(),
                    dateTo: dayjs(self.currentFilter.dates[1]).format(),
                };
                if (self.currentFilter.carrierId === '') {
                    delete params.carrierId;
                }
                return params;
            },

            get vehicleSummaryParameters(): RegionCarrierParams {
                return {
                    regionId: self.currentFilter.regionIdVehicleSummary,
                    carrierId: self.currentFilter.carrierId,
                    date: dayjs(self.currentFilter.dates[0]).format('YYYY-MM-DD'),
                };
            },

            get currentReportParams(): ContainerAreaParams | RegionCarrierParams {
                switch (self.currentFilter.name) {
                    case PLAN_FACT_KEYS.byArea:
                        return this.byAreaParameters;

                    case PLAN_FACT_KEYS.byDriver:
                        return this.byDriverParameters;

                    case PLAN_FACT_KEYS.vehicleSummary:
                        return this.vehicleSummaryParameters;

                    case REPORTS_TYPES.volumes:
                        return this.volumesReportParameters;

                    case REPORTS_TYPES.failRemoval:
                        return this.failRemovalReportParameters;

                    case REPORTS_KEYS.removalProblem:
                        return this.byDatesParameters;

                    case REPORTS_KEYS.inOut:
                        return this.inOutTransportParameters;

                    case PLAN_FACT_KEYS.byAreaWithCodes:
                        return this.byAreaParameters;

                    default:
                        return this.commonParameters;
                }
            },
        };
    })
    .actions(self => {
        const setNewEngineReport = (reportName: string, reportId: string, hash: string): ReportHTMLModelType => {
            let foundReport = self.newEngineReports.find((report: ReportHTMLModelType) => report.name === reportName);
            if (foundReport) {
                foundReport.id = reportId;
                foundReport.hash = hash;
            } else {
                self.newEngineReports.push({ name: reportName, id: reportId, hash } as ReportHTMLModelType);
                foundReport = self.newEngineReports.find((report: ReportHTMLModelType) => report.name === reportName)!;
            }
            foundReport.style = '';
            foundReport.body = '';
            return foundReport;
        };

        const setNewEngineReportHTML = (reportId: string, reportStyle: string, reportBody: string) => {
            const foundReport = self.newEngineReports.find((report: ReportHTMLModelType) => report.id === reportId)!;
            foundReport.style = reportStyle;
            foundReport.body = reportBody;
        };

        const getReportHTML = flow(function* (reportId: string) {
            self.isHTMLLoading = true;

            try {
                const downloadRequest: ExportToExcelParams = {
                    reportId,
                    reportFormat: 'HTML',
                };

                const { data, error } = yield ReportsService.downloadReport(downloadRequest);

                if (error) {
                    throw new Error(`Ошибка отображения отчета: ${error}`);
                }

                if (data) {
                    const blob = new Blob([data], { type: 'text/html' });
                    const html = yield blob.text();

                    if (!html) {
                        throw new Error('Не получено данных для формирования отчета');
                    }

                    setNewEngineReportHTML(
                        reportId,
                        html.substring(html.lastIndexOf('<style>') + 7, html.lastIndexOf('</style>')),
                        html.substring(html.lastIndexOf('<body>') + 6, html.lastIndexOf('</body>')),
                    );
                }
            } catch (error: any) {
                message.error(error.message);
            } finally {
                self.isHTMLLoading = false;
            }
        });

        const fetchReport = flow(function* (
            reportName: string,
            reportParameters: ContainerAreaParams | RegionCarrierParams,
            messageKey: string = 'fetchReport',
            needGetReportHTML: boolean = false,
        ) {
            self.isLoading = true;

            const fetchRequest: FetchReportParams = {
                reportName,
                reportParameters,
            };

            const messageConfig = {
                key: messageKey,
            };

            try {
                const fetchResponse = yield ReportsService.fetchReport(fetchRequest);

                if (fetchResponse.error) {
                    throw new Error(`Ошибка подготовки отчета: ${fetchResponse.error}`);
                }
                if (fetchResponse.data?.reportId) {
                    self.fetchedReportHash = objectHash({ reportName, reportParameters });
                    self.currentNewEngineReport = setNewEngineReport(
                        reportName,
                        fetchResponse.data.reportId,
                        objectHash({ reportName, reportParameters }),
                    );
                    if (needGetReportHTML) {
                        getReportHTML(fetchResponse.data.reportId);
                    }
                }
            } catch (error: any) {
                message.error({ ...messageConfig, content: error.message });
            } finally {
                self.isLoading = false;
            }
        });

        const exportToPDF = flow(function* (reportId: string, messageKey: string) {
            self.isExportLoading = true;

            const messageConfig = {
                key: messageKey,
            };

            try {
                const downloadRequest: ExportToExcelParams = {
                    reportId,
                    reportFormat: 'PDF',
                };

                const { data, error, headers } = yield ReportsService.downloadReport(downloadRequest);

                if (error) {
                    throw new Error(`Ошибка выгрузки отчета: ${error}`);
                }

                if (data) {
                    message.success({ ...messageConfig, content: 'Данные успешно экспортированы' });
                    downloadDataFromBlob(data, headers, 'application/pdf');
                }
            } catch (error: any) {
                message.error({ ...messageConfig, content: error.message });
            } finally {
                self.isExportLoading = false;
            }
        });

        const exportToExcel = flow(function* (reportId: string, messageKey: string) {
            self.isExportLoading = true;

            const messageConfig = {
                key: messageKey,
            };

            try {
                const downloadRequest: ExportToExcelParams = {
                    reportId,
                    reportFormat: 'XLSX',
                };

                const { data, error, headers } = yield ReportsService.downloadReport(downloadRequest);

                if (error) {
                    throw new Error(`Ошибка выгрузки отчета: ${error}`);
                }

                if (data) {
                    message.success({ ...messageConfig, content: 'Данные успешно экспортированы' });
                    downloadDataFromBlob(
                        data,
                        headers,
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    );
                }
            } catch (error: any) {
                message.error({ ...messageConfig, content: error.message });
            } finally {
                self.isExportLoading = false;
            }
        });

        const exportReportService = (
            service: string = EXPORT_SERVICES.google,
            downloadRequest: ExportToCloudDriveParams,
        ) => {
            switch (service) {
                case EXPORT_SERVICES.google:
                    return ReportsService.exportReportToGoogleDrive(downloadRequest);
                case EXPORT_SERVICES.yandex:
                    return ReportsService.exportReportToYandexDrive(downloadRequest);
                default:
                    return undefined;
            }
        };

        const setContainerAreas = (containerAreas: number[]) => {
            applySnapshot(self.containerAreas, containerAreas || []);
            // self.containerAreas.push(...containerAreas);
        };

        const exportToYandexGoogleSheets = flow(function* (
            service: string = EXPORT_SERVICES.google,
            reportId: string,
            messageKey,
        ) {
            self.isExportLoading = true;

            const messageConfig = {
                key: messageKey,
            };

            try {
                const downloadRequest: ExportToCloudDriveParams = {
                    reportId,
                };

                let exportReportResponse = yield exportReportService(service, downloadRequest);

                if (exportReportResponse.error) {
                    if (exportReportResponse.error.status === 500) {
                        message.error({ ...messageConfig, content: exportReportResponse.error.data.detail });
                        self.isExportLoading = false;
                    } else if (!exportReportResponse.error.data.detail?.startsWith('Refresh token is null')) {
                        message.error({ ...messageConfig, content: 'Ошибка экспорта' });
                        self.isExportLoading = false;
                    } else {
                        try {
                            const auth2 = yield window.gapi.auth2.getAuthInstance();

                            const googleUser = yield auth2.grantOfflineAccess({
                                prompt: 'select_account',
                            });

                            if (googleUser) {
                                const authResponse = yield AuthService.updateUserTokens(googleUser.code);
                                if (authResponse.error) {
                                    switch (service) {
                                        case EXPORT_SERVICES.google:
                                            throw new Error('Ошибка обновления токена аккаунта Google');
                                        case EXPORT_SERVICES.yandex:
                                            throw new Error('Ошибка обновления токена аккаунта Яндекс');
                                        default:
                                    }
                                }
                                exportReportResponse = yield exportReportService(service, downloadRequest);
                                if (exportReportResponse.error) {
                                    throw new Error('Ошибка экспорта');
                                }
                            }
                        } catch (authError: any) {
                            if (authError?.error === 'popup_closed_by_user') {
                                switch (service) {
                                    case EXPORT_SERVICES.google:
                                        message.warning({
                                            ...messageConfig,
                                            content:
                                                'Для экспорта в Google Sheets требуется авторизация аккаунта Google',
                                        });
                                        break;
                                    case EXPORT_SERVICES.yandex:
                                        message.warning({
                                            ...messageConfig,
                                            content:
                                                'Для экспорта в Яндекс Таблицы требуется авторизация аккаунта Яндекс',
                                        });
                                        break;
                                    default:
                                }
                            } else {
                                message.error({ ...messageConfig, content: authError.message });
                            }
                        } finally {
                            self.isExportLoading = false;
                        }
                    }
                }

                if (exportReportResponse.data) {
                    message.success({ ...messageConfig, content: 'Данные успешно экспортированы' });
                    window.open(exportReportResponse.data);
                }
            } catch (error: any) {
                message.error({ ...messageConfig, content: 'Ошибка экспорта' });
            } finally {
                self.isExportLoading = false;
            }
        });

        return {
            exportReport: flow(function* (
                reportName: string,
                messageKey: string,
                saveInGoogleDrive: boolean = false,
                saveOnYandexDisk: boolean = false,
                reportParameters: ContainerAreaParams | RegionCarrierParams = self.currentReportParams,
            ) {
                const parameters: GenerateReportParams = {
                    reportName,
                    parameters: {
                        ...reportParameters,
                        saveInGoogleDrive,
                        saveOnYandexDisk,
                    },
                    outputFormat: 'json',
                };

                const messageConfig = {
                    key: messageKey,
                };

                self.isExportLoading = true;

                let generateReportResponse = yield ReportsService.generateReport(parameters);

                if (generateReportResponse.error) {
                    if (!generateReportResponse.error.response.data.detail?.startsWith('Refresh token is null')) {
                        message.error({ ...messageConfig, content: 'Ошибка экспорта' });
                        self.isExportLoading = false;
                    } else {
                        try {
                            const auth2 = yield window.gapi.auth2.getAuthInstance();

                            const googleUser = yield auth2.grantOfflineAccess({
                                prompt: 'select_account',
                            });

                            if (googleUser) {
                                const authResponse = yield AuthService.updateUserTokens(googleUser.code);
                                if (authResponse.error) {
                                    throw new Error('Ошибка обновления токена аккаунта Google');
                                }
                                generateReportResponse = yield ReportsService.generateReport(parameters);
                                if (generateReportResponse.error) {
                                    throw new Error('Ошибка экспорта');
                                }
                            }
                        } catch (authError: any) {
                            if (authError?.error === 'popup_closed_by_user') {
                                message.warning({
                                    ...messageConfig,
                                    content: 'Для экспорта в Google Sheets требуется авторизация аккаунта Google',
                                });
                            } else {
                                message.error({ ...messageConfig, content: authError.message });
                            }
                        } finally {
                            self.isExportLoading = false;
                        }
                    }
                }

                if (generateReportResponse.data) {
                    let url = {
                        false: () => generateReportResponse.data?.params?.downloadUrl,
                        true: () => generateReportResponse.data?.params?.spreadsheetsUrl,
                    }[(saveInGoogleDrive || saveOnYandexDisk).toString()]();

                    if (url) {
                        message.success({ ...messageConfig, content: 'Данные успешно экспортированы' });

                        if (url[0] === '/') {
                            url = url.substr(1);
                        }

                        window.open(saveInGoogleDrive || saveOnYandexDisk ? url : `${APP_URL_BASE}${url}`, '_target');
                    }
                    self.isExportLoading = false;
                }
                setTimeout(() => message.destroy(messageKey), 4000);
            }),

            fetchReport,
            getReportHTML,
            setNewEngineReport,
            exportToPDF,
            exportToExcel,
            exportToYandexGoogleSheets,
            setContainerAreas,

            exportReportWithNewEngine: flow(function* (
                reportName: string,
                exportTo: ReportExportTypes,
                messageKey: string,
                reportParameters: ContainerAreaParams | RegionCarrierParams = self.currentReportParams,
            ) {
                if (self.fetchedReportHash !== objectHash({ reportName, reportParameters })) {
                    yield fetchReport(reportName, reportParameters, messageKey);
                }

                const reportId = self.getReportId(reportName);
                if (reportId) {
                    switch (exportTo) {
                        case EXPORT_TYPES.pdf:
                            yield exportToPDF(reportId, messageKey);
                            break;
                        case EXPORT_TYPES.excel:
                            yield exportToExcel(reportId, messageKey);
                            break;
                        case EXPORT_TYPES.googleSheets:
                            yield exportToYandexGoogleSheets(EXPORT_SERVICES.google, reportId, messageKey);
                            break;
                        case EXPORT_TYPES.yandexTable:
                            yield exportToYandexGoogleSheets(EXPORT_SERVICES.yandex, reportId, messageKey);
                            break;
                        default:
                    }
                }
                setTimeout(() => message.destroy(messageKey), 4000);
            }),

            loadReport: flow(function* () {
                const parameters = {
                    reportName: self.currentFilter.name,
                    parameters: self.currentReportParams,
                    outputFormat: 'json',
                };

                self.isLoading = true;
                const { data, error } = yield ReportsService.generateReport(parameters);

                if (data) {
                    const hash = self.currentReportHash;
                    self.reports.set(hash, { hash, ...data });
                    self.currentReport = hash as any;
                    self.isLoading = false;
                }

                if (error) {
                    self.isLoading = false;
                }
            }),
        };
    })
    .actions(self => ({
        updateCurrentReport() {
            self.currentReport = null;

            if (self.reports.has(self.currentReportHash)) {
                self.currentReport = self.currentReportHash as any;
            } else {
                self.loadReport();
            }
        },
        updateCurrentNewEngineReport(
            reportParameters: ContainerAreaParams | RegionCarrierParams = self.currentReportParams,
        ) {
            self.currentNewEngineReport = null;

            const foundReport = self.newEngineReports.find(
                (report: ReportHTMLModelType) =>
                    report.hash === objectHash({ reportName: self.currentFilter.name, reportParameters }),
            );
            if (foundReport) {
                self.currentNewEngineReport = foundReport;
            } else {
                self.fetchReport(self.currentFilter.name, reportParameters, undefined, true);
            }
        },
        updateByAreaReport() {
            self.currentNewEngineReport = null;

            if (!self.byArea.containerArea?.id && !(self.containerAreas.length > 0)) {
                self.currentNewEngineReport = self.setNewEngineReport(self.currentFilter.name, '', '');
            } else {
                const foundReport = self.newEngineReports.find(
                    (report: ReportHTMLModelType) =>
                        report.hash ===
                        objectHash({ reportName: self.currentFilter.name, reportParameters: self.byAreaParameters }),
                );
                if (foundReport) {
                    self.currentNewEngineReport = foundReport;
                } else {
                    self.fetchReport(self.currentFilter.name, self.byAreaParameters, undefined, true);
                }
            }
        },
    }))
    .actions(self => ({
        getAvailableRegions: flow(function* () {
            const { data } = yield RegionsService.getAvailableRegions();

            if (data) {
                applySnapshot(self.garbageRegions, data || []);
                if (self.currentFilter.name === REPORTS_TYPES.volumes) {
                    self.currentFilter.update({ regionIds: [data[0].id] });
                    self.updateCurrentNewEngineReport();
                } else {
                    self.currentFilter.update({ currentRegionId: data[0].id });
                    self.updateCurrentReport();
                }
            }
        }),

        setCurrentFilter(reportName: string) {
            self.currentFilter = reportName as any;

            // TODO: надо изменять определения инициирующего значения carrierId
            const {
                userStore: { user },
            } = getRoot(self);

            switch (self.currentFilter.name) {
                case REPORTS_TYPES.volumes:
                    if (self.currentFilter.regionIdVolume === '')
                        self.currentFilter.regionIdVolume = user.regions[0]?.id;
                    break;

                case REPORTS_TYPES.failRemoval:
                    if (self.currentFilter.regionIdPlanFail === '')
                        self.currentFilter.regionIdPlanFail = user.regions[0]?.id;
                    break;

                case REPORTS_KEYS.removalProblem:
                    if (self.currentFilter.regionIdRemovalProblem === '')
                        self.currentFilter.regionIdRemovalProblem = user.regions[0]?.id;
                    break;

                case REPORTS_KEYS.inOut:
                    if (self.currentFilter.regionIdTransport === '')
                        self.currentFilter.regionIdTransport = user.regions[0]?.id;
                    break;

                default:
                    break;
            }

            if (user?.carriers?.length === 1) {
                self.currentFilter.carrierId = user.carriers[0].id;
            }
        },

        setCurrentReportDates(dates: dayjs.Dayjs[]) {
            self.currentReportDates = cast(dates);
        },
    }));

export type ReportDatesMode = 'day' | 'week' | 'month' | 'year';
