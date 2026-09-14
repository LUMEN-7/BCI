import { Component } from "react";

import Error from "../../pages/Error";


export default class GlobalErrorBoundary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            error: null,
        };
    }


    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
        };
    }


    componentDidCatch(error, errorInfo) {
        console.error("Erro global capturado pelo BCI:", error);
        console.error("Informações adicionais:", errorInfo);
    }


    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
        });

        window.location.href = "/home";
    };


    render() {
        if (this.state.hasError) {
            return (
                <Error
                    statusCode={500}
                    errorMessage={this.state.error?.message}
                    onReset={this.handleReset}
                />
            );
        }

        return this.props.children;
    }
}