import React from 'react';
import { Layout, Tabs } from 'antd';
import { REPORTS } from '@/constants';
import { observer } from 'mobx-react';
import { Switch, Route, Redirect, useRouteMatch, useLocation } from 'react-router-dom';

import { PlanFact } from './components/PlanFact';
import { PlanFail } from './components/PlanFail';
import { Transport } from './components/Transport';
import { RemovalProblem } from './components/RemovalProblem';
import { NavLink } from '@/components/common/NavLink';

import { useRootStore } from '@/store';
import styles from './Reports.module.scss';
import { Volumes } from '@/modules/Reports/components/Volumes';

const { Content } = Layout;
const { TabPane } = Tabs;

const { REPORTS_TYPES, REPORTS_TITLES } = REPORTS;
const [PLAN_FACT, VOLUMES, PLAN_FAIL, REMOVAL_PROBLEM, TRANSPORT] = Object.keys(REPORTS_TYPES);

export const Reports = observer(() => {
    const {
        reportsStore: { setCurrentFilter },
    } = useRootStore();

    const match = useRouteMatch();
    const location = useLocation();

    const getTabActiveKey = (path: string): string => {
        const routes = Object.keys(REPORTS_TYPES);
        return routes.filter(item => path.includes(item))[0];
    };

    const onChange = (activeKey: string) => {
        setCurrentFilter(REPORTS_TYPES[activeKey]);
    };

    return (
        <Content className={styles['wrapper']}>
            <Tabs
                className={styles['tabs']}
                activeKey={getTabActiveKey(location.pathname) || PLAN_FACT}
                onChange={onChange}
            >
                {Object.keys(REPORTS_TYPES).map(tab => (
                    <TabPane
                        className={styles['tabs-pane']}
                        tab={<NavLink to={`${match.path}/${tab}`} label={REPORTS_TITLES[tab]} />}
                        key={tab}
                    />
                ))}
            </Tabs>
            <div className={styles['reports-content']}>
                <Switch>
                    <Route path={`${match.path}/${PLAN_FACT}`} component={PlanFact} />
                    <Route path={`${match.path}/${VOLUMES}`} component={Volumes} />
                    <Route path={`${match.path}/${PLAN_FAIL}`} component={PlanFail} />
                    <Route path={`${match.path}/${REMOVAL_PROBLEM}`} component={RemovalProblem} />
                    <Route path={`${match.path}/${TRANSPORT}`} component={Transport} />
                    <Route exact path={match.path} render={() => <Redirect to={`${match.path}/${PLAN_FACT}`} />} />
                </Switch>
            </div>
        </Content>
    );
});
