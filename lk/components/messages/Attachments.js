import React from 'react';
import PropTypes from 'prop-types';
import {humanFileSize} from '../../../utils/utility';
import Icon from './../common/Icon';
import Lightbox from 'react-image-lightbox';
import applicationConfig from './../../../utils/applicationConfig';
import ImageLoader from '../common/ImageLoader';
import IconCamera from 'material-ui/svg-icons/image/photo-camera';

/**
 * Компонент - Прикрепления (файлы)
 */
export default class Attachments extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			imagesCount: props.attachments.filter(att => att.type.startsWith('image')).length || 0,
			filesCount: props.attachments.filter(att => !att.type.startsWith('image')).length || 0,
			lightboxIsOpen: false,
			currentImage: 0,
		};
	}

	static propTypes = {
		attachments: PropTypes.array.isRequired,
		className: PropTypes.string,
	};

	static defaultProps = {
		attachments: []
	};

	closeLightbox = () => {
		this.setState({lightboxIsOpen: false});
	};

	handlePrevImage = () => {
		const {currentImage, imagesCount} = this.state;
		this.setState({currentImage: (currentImage + imagesCount - 1) % imagesCount});
	};

	handleNextImage = () => {
		const {currentImage, imagesCount} = this.state;
		this.setState({currentImage: (currentImage + 1) % imagesCount});
	};

	renderImages = (images) => {
		if (images && images.length > 0) {
			const imgFileCodes = images.map(image => image.fileCode);
			return (
				<div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}}>
					{images.map((image, i) =>
						<ImageLoader
							key={image.fileCode} src={`${applicationConfig.APPLICATION_FILE_DOWNLOAD_URL}${image.fileCode}`} style={{cursor: 'pointer', height: '156px', width: '218px'}} onClick={() => this.setState({lightboxIsOpen: true, currentImage: i})} imagePlaceHolder={
								<IconCamera style={{height: '128px', width: '128px', color: '#c1c1c1'}}/>}/>)}
					{this.state.lightboxIsOpen && (
						<Lightbox
							prevSrc={`${applicationConfig.APPLICATION_FILE_DOWNLOAD_URL}${imgFileCodes[(this.state.currentImage + imgFileCodes.length - 1) % imgFileCodes.length]}`}
							mainSrc={`${applicationConfig.APPLICATION_FILE_DOWNLOAD_URL}${imgFileCodes[this.state.currentImage]}`}
							nextSrc={`${applicationConfig.APPLICATION_FILE_DOWNLOAD_URL}${imgFileCodes[(this.state.currentImage + 1) % imgFileCodes.length]}`}
							onCloseRequest={this.closeLightbox}
							onMovePrevRequest={this.handlePrevImage}
							onMoveNextRequest={this.handleNextImage}/>
					)}
				</div>
			);
		}
		return null;
	};

	renderFiles = (files) => {
		if (files && files.length > 0) {
			return (
				<ul className="has-dividers--top-space">
					{files.map(file =>
						<li key={file.fileCode} className="list__item">
							<div className="media">
								<div className="media__figure">
									<Icon category="doctype" icon={'unknown'}/>
								</div>
								<div className="media__body">
									<h3 className="truncate">
										<a href={`${applicationConfig.APPLICATION_FILE_DOWNLOAD_URL}${file.fileCode}`} target="_blank" title={file.fileName}>{file.fileName}</a>
									</h3>
									<p className="text-body--small">
										{humanFileSize(file.fileSize)}
									</p>
								</div>
							</div>
						</li>
					)}
				</ul>
			);
		}
		return null;
	};

	render() {
		const {attachments} = this.props;
		if (attachments && attachments.length > 0) {
			const images = attachments ? attachments.filter(att => att.type.startsWith('image')) : [];
			const files = attachments ? attachments.filter(att => !att.type.startsWith('image')) : [];
			return (
				<div className={this.props.className}>
					{this.renderImages(images)}
					{this.renderFiles(files)}
				</div>
			);
		} else {
			return null;
		}
	}
}

