import React from 'react';
import PropTypes from 'prop-types';
import {AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader, List} from 'react-virtualized';
import {chatSort} from '../utils';
import Announcement from './Announcement';
import Spinner from '../../common/Spinner';

/**
 * Компонент - Список объявлений
 */
export default class AnnouncementList extends React.Component {

	constructor(props) {
		super(props);
		this.cache = new CellMeasurerCache({defaultHeight: 200, fixedWidth: true});
	}

	static propTypes = {
		chats: PropTypes.array.isRequired,
		hasMoreChats: PropTypes.bool.isRequired,
		onGetChatFull: PropTypes.func.isRequired,
		onGetViewers: PropTypes.func.isRequired,
		onLoadMore: PropTypes.func.isRequired,
		onReadMessage: PropTypes.func,
		uid: PropTypes.string.isRequired,
	};

	static defaultProps = {
		chats: [],
		onLoadMore: () => {}
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.chats.length !== nextProps.chats.length) {
			this.cache.clearAll();
		}
	}

	announcementRenderer = ({key, index, style, parent}) => {
		const {uid, chats} = this.props;
		if (!this.isRowLoaded({index})) {
			return (
				<div key={key} style={{...style, height: '64px', top: style.top + 10 * index}} className="announcement text-align--center p-around--medium is-relative">
					<Spinner/>
				</div>
			);
		} else {
			const chat = chats.sort(chatSort)[index];
			return (
				<CellMeasurer key={index} cache={this.cache} parent={parent} rowIndex={index} columnIndex={0}>
					{({measure}) => (
						<Announcement style={{...style, top: style.top + 10 * index}} onImageLoad={measure} uid={uid} chat={chat} onGetChatFull={this.props.onGetChatFull} onGetViewers={this.props.onGetViewers} onReadMessage={this.props.onReadMessage}/>
					)}
				</CellMeasurer>
			);
		}
	};
	noChatsRenderer = () => (
		<div className="chat text-align--center p-around--medium">
			Объявления не найдены
		</div>
	);
	isRowLoaded = ({index}) => !this.props.hasMoreChats || index < this.props.chats.length;
	loadMoreRows = ({startIndex, stopIndex}) => this.props.onLoadMore({type: 'ANNOUNCEMENT', offset: startIndex, limit: 25});

	render() {
		const {chats, hasMoreChats} = this.props;
		const rowsCount = chats.length + (hasMoreChats ? 1 : 0);

		return (
			<div style={{flex: '1 1 auto'}}>
				<InfiniteLoader isRowLoaded={this.isRowLoaded} loadMoreRows={this.loadMoreRows} rowCount={rowsCount}>
					{({onRowsRendered, registerChild}) =>
						<AutoSizer>
							{({height, width}) =>
								<List className="scroller__container" ref={registerChild} containerStyle={{overflow: 'visible'}} deferredMeasurementCache={this.cache} overscanRowCount={15} noRowsRenderer={this.noChatsRenderer} onRowsRendered={onRowsRendered} rowCount={rowsCount} rowHeight={this.cache.rowHeight} onScroll={this.onScroll} rowRenderer={this.announcementRenderer} width={width} height={height}/>
							}
						</AutoSizer>
					}
				</InfiniteLoader>
			</div>
		);
	}
}