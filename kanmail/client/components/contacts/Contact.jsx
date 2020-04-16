import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { delete_, put } from 'util/requests.js';


export default class Contact extends React.Component {
    static propTypes = {
        deleteContact: PropTypes.func.isRequired,
        id: PropTypes.number.isRequired,
        email: PropTypes.string.isRequired,
        name: PropTypes.string,
    }

    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            name: props.name,
            email: props.email,
        };
    }

    handleClickEdit = () => {
        this.setState({
            editing: true,
            deleteConfirm: false,
        });
    }

    handleClickCancel = () => {
        this.setState({
            editing: false,
            deleteConfirm: false,
            name: this.props.name,
            email: this.props.email,
        });
    }

    updateState = (key, ev) => {
        this.setState({
            [key]: ev.target.value,
        });
    }

    handleClickUpdate = () => {
        put(`/api/contacts/${this.props.id}`, this.state)
            .then(() => this.setState({editing: false}))
            .catch(err => console.error('CONTACT ERROR', err));
    }

    handleClickDelete = () => {
        if (!this.state.deleteConfirm) {
            this.setState({
                deleteConfirm: true,
            });
            return;
        }

        delete_(`/api/contacts/${this.props.id}`)
            .then(() => this.props.deleteContact(this.props.id))
            .catch(err => console.error('CONTACT ERROR', err));
    }

    renderFormOrText() {
        if (!this.state.editing) {
            if (this.state.name) {
                return <div className="text">{this.state.name} ({this.state.email})</div>;
            }

            return <div className="text">{this.state.email}</div>;
        }

        return (
            <div className="form">
                <input
                    type="text"
                    value={this.state.name || ''}
                    onChange={_.partial(this.updateState, 'name')}
                />
                <input
                    type="email"
                    value={this.state.email}
                    onChange={_.partial(this.updateState, 'email')}
                />
            </div>
        );
    }

    renderButtons() {
        if (this.state.deleteConfirm) {
            return (
                <div>
                    <button onClick={this.handleClickCancel}>Cancel</button>&nbsp;
                    <button
                        className="cancel"
                        onClick={this.handleClickDelete}
                    >Are you SURE?</button>
                </div>
            );
        }

        if (this.state.editing) {
            return (
                <div>
                    <button
                        className="submit"
                        onClick={this.handleClickUpdate}
                    >Update</button>&nbsp;
                    <button onClick={this.handleClickCancel}>Cancel</button>
                </div>
            );
        }

        return (
            <div>
                <button onClick={this.handleClickEdit}>Edit</button>&nbsp;
                <button onClick={this.handleClickDelete} className="cancel">Delete</button>
            </div>
        );
    }

    render() {
        if (this.state.deleted) {
            return null;
        }

        return (
            <div className="contact">
                {this.renderFormOrText()}
                <div className="buttons">
                    {this.renderButtons()}
                </div>
            </div>
        );
    }
}
