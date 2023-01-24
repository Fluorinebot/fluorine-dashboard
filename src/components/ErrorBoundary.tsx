import { Component, PropsWithChildren, ErrorInfo } from 'react';
import { CLIENT_ID, REDIRECT_URI } from '../lib/constants';

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

export function Authorize() {
    return (
        <div>
            <h2 className="headingTwo textHeading">You need to login.</h2>
            <p className="moveFromButton">To continue, you must authorize with Discord.</p>
            <a
                href={`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify%20guilds`}
                className="ctaButton"
            >
                Continue with Discord
            </a>
        </div>
    );
}
