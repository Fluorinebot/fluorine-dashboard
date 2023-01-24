import { Component, PropsWithChildren, ErrorInfo } from 'react';

export const ErrorMessage: React.FC<{}> = () => (
    <div className="noticeBox">
        <div>
            <h1 className="headingTwo textHeading">Something went wrong.</h1>
            <p className="grey">Please try again. If this problem persits, inform the developers.</p>
        </div>
    </div>
);
export class ContentBoundary extends Component<PropsWithChildren, { hasError: boolean }> {
    constructor(props: PropsWithChildren) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorMessage />;
        }

        return this.props.children;
    }
}

export class AsideBoundary extends Component<PropsWithChildren, { hasError: boolean }> {
    constructor(props: PropsWithChildren) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h1 className="headingTwo textHeading">Something went wrong.</h1>
                    <p className="grey">Please try again. If this problem persits, inform the developers.</p>
                </div>
            );
        }

        return this.props.children;
    }
}
