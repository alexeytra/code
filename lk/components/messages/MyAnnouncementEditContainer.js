import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import IconChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import EditAnnouncement from './forms/EditAnnouncement';
import {editAnnouncement} from '../../../actions/MessengerActions';

/**
 * Контейнер - Мои объявления
 */
class MyAnnouncementEditContainer extends React.Component {

	static propTypes = {
		chat: PropTypes.object,
		editAnnouncement: PropTypes.func.isRequired,
		history: PropTypes.object,
		message: PropTypes.object,
		messageId: PropTypes.string
	};

	handleSubmit = (ann) => {
		ann.id = this.props.chat.id;
		this.props.editAnnouncement(ann, this.props.messageId)
	};

	handleSubmitSuccess = () => {
		const {history} = this.props;
		return history.push('/im/myannouncements');
	};

	render() {
		const {chat, message} = this.props;
		return (
			<div className="container container--wb">
				<div className="toolbar">
					<div className="toolbar__first">
						<button
							type="button" className="button button--icon"
							onClick={() => this.props.history.goBack()}>
							<IconChevronLeft style={{color: 'inherit'}}/>
						</button>
					</div>
					<div className="toolbar__title">
						Редактирование объявления
					</div>
				</div>
				<EditAnnouncement name={chat.name} message={message.message} onEditAnnouncement={this.handleSubmit} onSubmitSuccess={this.handleSubmitSuccess}/>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	const id = ownProps.match.params.id;
	const messageId = Object.keys(state.messenger.messages)
		.filter(value => state.messenger.messages[value].peerId === parseInt(id))[0];
	return {
		id,
		chat: state.messenger.chats[id],
		message: state.messenger.messages[messageId],
		messageId
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({editAnnouncement}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAnnouncementEditContainer);