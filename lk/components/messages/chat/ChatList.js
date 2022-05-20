import React from 'react';
import PropTypes from 'prop-types';
import {AutoSizer, CellMeasurerCache, InfiniteLoader, List} from 'react-virtualized';
import Chat from './Chat';
import {chatSort} from '../utils';
import Spinner from '../../common/Spinner';

/**
 * Компонент - Список чатов
 */
export default class ChatList extends React.Component {

	constructor(props) {
		super(props);
		this.cache = new CellMeasurerCache({defaultHeight: 200, fixedWidth: true});
	}

	static propTypes = {
		chatType: PropTypes.string.isRequired,
		chats: PropTypes.array.isRequired,
		hasMoreChats: PropTypes.bool.isRequired,
		onLoadMore: PropTypes.func.isRequired,
		onSelectChat: PropTypes.func.isRequired,
	};

	static defaultProps = {
		chats: [],
		chatType: 'DIALOGUE',
		onSelectChat: () => {},
		onLoadMore: () => {}
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.chatType !== nextProps.chatType) {
			this.list.scrollToPosition(0);
		}
	}

	chatRenderer = ({key, index, style}) => {
		const {chats, chatType} = this.props;
		const chat = chats.sort(chatSort)[index];
		if (chat) {
			return (
				<div key={key} style={style}>
					<Chat chat={chat} chatType={chatType} onSelectChat={this.props.onSelectChat}/>
				</div>
			);
		} else {
			return (
				<div key={key} style={style} className="text-align--center p-around--medium is-relative">
					<Spinner/>
				</div>
			);
		}
	};

	noChatsRenderer = () => (
		<div className="chat text-align--center p-around--medium">
			{chatNotFound(this.props.chatType)}
		</div>
	);

	isRowLoaded = ({index}) => !this.props.hasMoreChats || index < this.props.chats.length;

	loadMoreRows = ({startIndex, stopIndex}) => this.props.onLoadMore({type: this.props.chatType, offset: startIndex, limit: 25});

	render() {
		const {chats, hasMoreChats} = this.props;
		const rowsCount = chats.length + (hasMoreChats ? 1 : 0);
		return (
			<div style={{flex: '1 1 auto'}}>
				<InfiniteLoader isRowLoaded={this.isRowLoaded} loadMoreRows={this.loadMoreRows} rowCount={rowsCount}>
					{({onRowsRendered, registerChild}) => (
						<AutoSizer>
							{({height, width}) => (
								<List
									className="scroller__container"
									containerStyle={{overflow: 'visible'}}
									ref={(node) => {
										this.list = node;
										registerChild(node);
									}}
									rowRenderer={this.chatRenderer}
									noRowsRenderer={this.noChatsRenderer}
									onRowsRendered={onRowsRendered}
									onScroll={this.onScroll}
									rowCount={rowsCount}
									rowHeight={64}
									width={width}
									height={height}/>
							)}
						</AutoSizer>
					)}
				</InfiniteLoader>
			</div>
		);
	}
}
const chatNotFound = (chatType) => {
	switch (chatType) {
		case 'ANNOUNCEMENT':
			return 'Объявления не найдены';
		case 'CHAT':
			return 'Обсуждения не найдены';
		case 'DIALOGUE':
			return 'Диалоги не найдены';
		case 'SUPPORT':
			return 'Нет обращений в техподдержку';
		case 'APPEAL':
			return 'Нет обращений';
		case 'QUIZ':
			return 'Нет опросов для прохождения';
		// case 'MYQUIZ':
		// 	return 'Опросы не найдены';
		default:
			return `${chatType} not found`;
	}
};