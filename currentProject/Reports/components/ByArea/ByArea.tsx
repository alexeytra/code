import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Space, Form, AutoComplete, Typography, Input, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import qs from 'query-string';

import { SearchEntityInstanceModelType, useQuery } from '@/models';
import { ReportsBody } from '../ReportsBody';
import styles from './ByArea.module.scss';

const { Text } = Typography;

const searchAttributes = [
    {
        entityName: 'ContainerArea',
        attributeName: 'address',
    },
    {
        entityName: 'ContainerArea',
        attributeName: 'code',
    },
    // TODO: добавить сущность?
    // {
    //     entityName: 'OwnerCompany',
    //     attributeName: 'fullName',
    // },
];

export const ByArea = observer(() => {
    const {
        store: {
            reportsStore: {
                byArea: { searchValue, containerArea, setSearchValue, setContainerArea, onSearch, containerAreaSearch },
                setContainerAreas,
            },
            searchStore: {
                isSearchProcessing,
                searchedEntities,
                planFactByAreaSearchHistory,
                searchEntity,
                saveSearchHistory,
                clearSearchedEntities,
            },
        },
    } = useQuery();

    const history = useHistory();
    const { search } = useLocation();
    const formRef = useRef(null);

    const [isContainerAreas, setIsContainerAreas] = useState<boolean>(false);
    const [selectedContainerAreas, setSelectedContainerAreas] = useState<number[]>([]);

    useEffect(() => {
        if (!containerArea) {
            const url = qs.parseUrl(search);
            const { lkCode } = url.query;

            if (!searchValue && lkCode) {
                const query = searchEntity(lkCode as string, searchAttributes);
                query.promise.then(() => {
                    const { entities } = query.data!;
                    if (entities && entities.length > 0) {
                        containerAreaSearch(entities[0].instanceId);
                        (formRef.current as any).setFieldsValue({ search: entities[0].attributeValue });
                        setSearchValue(entities[0].attributeValue || '');
                    }
                });
            }
        }
    }, [search, containerArea]);

    useEffect(() => {
        if (containerArea) {
            history.push({ search: `lkCode=${containerArea.lkCode}` });
        }
    }, [containerArea]);

    const onSearchValuesChange = debounce((value: { search: string }) => {
        let isCA: boolean = false;
        let currentContainerAreas: number[] = [];
        if (value.search.trim()) {
            currentContainerAreas = value.search.split(' ').map((val: string) => Number(val));
            isCA = currentContainerAreas.every((val: any) => !Number.isNaN(val) && typeof val === 'number');
        }
        if (isCA) {
            setIsContainerAreas(isCA);
            setSelectedContainerAreas(currentContainerAreas);
        }
        if (value.search.trim() && !isCA) {
            searchEntity(value.search, searchAttributes);
            setSearchValue(value.search);
        }
    }, 400);

    const onSearchValueSelect = (value: string, option: any) => {
        const { key } = option;
        const searchedEntity = searchedEntities.find((entity: SearchEntityInstanceModelType) => {
            return entity.instanceId === key;
        });

        if (searchedEntity) {
            onSearch(searchedEntity);
            saveSearchHistory('planFactByAreaSearchHistory', searchedEntity);
        } else {
            const searchHistoryEntity = planFactByAreaSearchHistory.find((entity: SearchEntityInstanceModelType) => {
                return entity.instanceId === key;
            });
            if (searchHistoryEntity) {
                onSearch(searchHistoryEntity);
            }
        }
    };

    const onSearchValueChange = (value: string) => {
        if (!value) {
            history.push({ search: '' });

            setSearchValue('');
            setContainerArea(null);
            clearSearchedEntities();
            setContainerAreas([]);
            setSelectedContainerAreas([]);
            setIsContainerAreas(false);
        }
    };

    const getOptions = () => {
        if (searchedEntities.length > 0) {
            return searchedEntities.slice().map((entity: SearchEntityInstanceModelType) => {
                return {
                    key: entity.instanceId,
                    value: entity.attributeValue || '',
                };
            });
        }
        if (planFactByAreaSearchHistory.length > 0) {
            return planFactByAreaSearchHistory.slice().map((entity: SearchEntityInstanceModelType) => {
                return {
                    key: entity.instanceId,
                    value: entity.attributeValue || '',
                };
            });
        }
        return undefined;
    };

    const onSearchByContainerAreas = () => {
        if (isContainerAreas && selectedContainerAreas.length > 0) {
            setContainerAreas(selectedContainerAreas);
            history.push({ search: `containerAreas=${selectedContainerAreas}` });
        }
    };

    const renderContainerAreaSearch = (initSearchValue?: string) => {
        return (
            <Form ref={formRef} initialValues={{ search: initSearchValue }} onValuesChange={onSearchValuesChange}>
                <Form.Item name="search" noStyle>
                    <AutoComplete
                        className={styles['search']}
                        placeholder="Поиск..."
                        onSelect={onSearchValueSelect}
                        onChange={onSearchValueChange}
                        options={getOptions()}
                        onBlur={onSearchByContainerAreas}
                    >
                        <Input suffix={<SearchOutlined />} allowClear />
                    </AutoComplete>
                </Form.Item>
            </Form>
        );
    };

    return (
        <div className={styles['wrapper']}>
            <Space size={24} align="center" className={styles['search-row']}>
                <Text>Контейнерная площадка:</Text>
                {renderContainerAreaSearch(searchValue)}
                <Spin size="small" spinning={isSearchProcessing} />
            </Space>
            <ReportsBody tableLayout="fixed" width={400} />
        </div>
    );
});
