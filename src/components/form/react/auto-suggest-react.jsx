import React from 'react';
import Autosuggest from 'react-autosuggest';

'use strict';

export default class AutoSuggestReact extends React.Component {
    constructor(props) {
        super(props);

        this.options = Object.assign({}, this.props.options);

        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);

        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.getSuggestionValue = this.getSuggestionValue.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
    }

    onFocus(event) {
        this.text = event.target.value;
    }
    onChange(event, {newValue, method}) {
        this.setState({ label: newValue });
    }

    onBlur(event, suggestion) {
        var value = this.text === event.target.value ? this.state.value : suggestion.focusedSuggestion;
        var text = (value || '').toString();
        this.setState({ value: value, label: text });
        if (this.props.onChange)
            this.props.onChange(event, value);
    }

    onSuggestionsFetchRequested({value}) {
        var suggestions = (this.options && this.options.suggestions) || [];
        Promise.resolve(typeof (suggestions) === "function" ? suggestions(value) : suggestions)
            .then(result => {
                this.setState({ suggestions: result });
            });
    }

    onSuggestionsClearRequested() {
        this.setState({ suggestions: [] });
    }

    onSuggestionSelected(event, {suggestion, suggestionValue, sectionIndex, method}) {
        this.text = (suggestion || '').toString();
        this.setState({ value: suggestion });
        if (this.props.onChange)
            this.props.onChange(event, suggestion);
    }

    getSuggestionValue(suggestion) {
        return (suggestion || '').toString();
    }

    renderSuggestion(suggestion) {
        var func = this.options.renderSuggestion || function (s) {
            return (<span>{(s || '').toString() }</span>);
        };

        return func(suggestion);
    }

    componentWillMount() {
        this.setState({ value: this.props.value, label: (this.props.value || '').toString(), suggestions: [] });
    }

    componentWillReceiveProps(props) {
        var label = (props.value || '').toString();
        this.setState({ value: props.value, label: label });
    }

    render() {
        this.options = Object.assign({}, this.props.options);

        var {value, label, suggestions} = this.state;
        var inputProps = {
            placeholder: '',
            value: label,
            onChange: this.onChange,
            onBlur: this.onBlur,
            onFocus: this.onFocus
        }

        return (
            <Autosuggest
                suggestions = {suggestions}
                onSuggestionsFetchRequested = {this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested = {this.onSuggestionsClearRequested}
                onSuggestionSelected = {this.onSuggestionSelected}
                getSuggestionValue = {this.getSuggestionValue}
                renderSuggestion = {this.renderSuggestion}
                inputProps = {inputProps}
                />
        );
    }
}

AutoSuggestReact.defaultProps = { data: [] };
