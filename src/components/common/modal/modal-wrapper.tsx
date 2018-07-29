import './style.scss';
import React, { Component, ReactChildren } from 'react';
import { createPortal } from 'react-dom'
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router'
import { History } from 'node_modules/@types/history';

import { wait } from 'utils/async'

const CLOSE_DURATION = 300
const MODAL_CONTAINER_CLASS = '.modal-container'
let SCROLL_BAR_WIDTH: null | number = null

interface ChildComponentProps {
	close?: () => void
	history: History
}

export interface OpenModalOptions {
	autoShow?: boolean;
	center?: boolean;
	animation?: string;
	contentWrapperClass?: string;
	disableRouteChangeClose?: boolean
}
const defaultOpenModalOptions = {
	center: true,
	contentWrapperClass: '',
}

function selectAnimation(animation?: string) {
	switch (animation) {
		case 'fade-in':
			return 'anim_fade-in'
		case 'fade-drop-in':
			return 'anim_fade-drop-in'
		case 'scale-fade-in':
		default:
			return 'anim_scale-fade-in'
	}
}

export default function newModal(options: OpenModalOptions = {}) {
	return (ModalContent: ReactChildren) => {
		@observer
		class Modal extends Component<ChildComponentProps, {}> {
			@observable isVisible = false;
			// @observable classes = '';
			@observable anim = selectAnimation();
			// @observable dialogStyles = {};
			@observable contentWrapperClass = '';
			@observable center = false;
			historyListen?: () => void;

			bg!: HTMLElement;
			content!: HTMLElement;

			componentDidMount(){
				this._scroll()

				// show bg
				this._initialShow()

				if (!options.disableRouteChangeClose){
					this.historyListen = this.props.history.listen(() => {
						if (this.props.history.length){
							this.closeModal()
						}
					})
				}
			}
			componentWillUnmount(){
				// remove history event listener
				this.historyListen && this.historyListen()

				// remove scroll stuff
				this._scrollTearDown()
			}

			_scroll(){
				document.documentElement.classList.add('no-scroll')

				// windows scroll bar support
				if (SCROLL_BAR_WIDTH === null){
					SCROLL_BAR_WIDTH = calcScrollBarWidth()
				}
				if (SCROLL_BAR_WIDTH){
					document.documentElement.style.paddingRight = `${SCROLL_BAR_WIDTH}px`
				}
			}
			_scrollTearDown(){
				const modals = document.querySelectorAll('.modal__wrapper')
				// TODO - potential bug where if multiple modals are open
				// and the route changes, total open won't be 1 and this wont trigger?
				if (modals.length === 1){
					// if this is the last modal left open, remove no scroll
					document.documentElement.classList.remove('no-scroll')
					document.documentElement.style.paddingRight = `0`
				}
			}

			@action async _initialShow(){
				await wait(0)
				this.bg.style.opacity = `0.85`

				// if `autoshow` was set, just display modal content
				// immediately with options passed to decorator
				if (options.autoShow){
					this.showContent(options)
				}
			}

			@action showContent = async (opts: OpenModalOptions) => {
				const options = Object.assign({}, defaultOpenModalOptions, opts)
				if (options.animation){
					this.anim = selectAnimation(options.animation)
				}
				if (options.contentWrapperClass){
					this.contentWrapperClass = options.contentWrapperClass
				}
				if (typeof options.center === 'boolean') {
					this.center = options.center;
				}

				// actually display
				await wait(0)
				this.isVisible = true;
			}

			@action closeModal = async () => {
				// animate and close
				this.content.style.opacity = `0`
				this.bg.style.opacity = `0`

				await wait(CLOSE_DURATION)

				if (this.props.close){
					// tell parent to remove from dom (if function is provided)
					this.props.close()
				}
			}

			render() {
				return createPortal(
					<div className="modal__wrapper">
						<div
							onClick={this.closeModal}
							className="modal__bg"
							ref={el => this.bg = el}>
						</div>
						<div
							// ref={el => this.dialog = el}
							className={`
								modal__dialog
								${this.contentWrapperClass}
								${this.center ? 'type_center' : ''}
							`}
								// ${this.classes}
							// style={this.dialogStyles}
							>
							<div
								ref={el => this.content = el}
								className={`
									modal__content
									${this.anim}
									${this.isVisible ? 'state_visible' : ''}
								`}
									// ${this.classes}
							>
								<ModalContent
									{...this.props}
									showContent={this.showContent}
									closeModal={this.closeModal}
								/>
							</div>
						</div>
					</div>,

					document.querySelector(MODAL_CONTAINER_CLASS)
				)
			}
		}
		return withRouter(Modal);
	}
}

function calcScrollBarWidth(): number {
	const scrollDiv = document.createElement('div');
	scrollDiv.className = 'modal__scrollbar-measure';
	document.body.appendChild(scrollDiv);
	const width = scrollDiv.offsetWidth - scrollDiv.clientWidth;
	document.body.removeChild(scrollDiv);
	return width;	
}