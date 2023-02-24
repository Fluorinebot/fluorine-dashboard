import { Box, Button, Center, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { Component, PropsWithChildren, ErrorInfo } from 'react';
import { MdError } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { CLIENT_ID, REDIRECT_URI } from '#/lib/constants';

export const ErrorMessage: React.FC<{
    heading: string;
    message: string;
    link?: string;
    isExternal?: boolean;
    button?: string;
}> = ({ link, message, heading, isExternal, button }) => {
    return (
        <Center height={'100vh'} width={'100%'}>
            <Flex gap={2}>
                <Icon as={MdError} h={10} w={10}></Icon>
                <Box>
                    <Heading size="md">{heading}</Heading>
                    <Text size="md">{message}</Text>

                    {isExternal ? (
                        <Button as="a" marginTop={2} href={link ?? '/'} colorScheme="brand">
                            {button ?? 'Return to home'}
                        </Button>
                    ) : (
                        <Button as={Link} marginTop={2} to={link ?? '/'} colorScheme="brand">
                            {button ?? 'Return to home'}
                        </Button>
                    )}
                </Box>
            </Flex>
        </Center>
    );
};

export class SidebarBoundary extends Component<PropsWithChildren, { hasError: boolean }> {
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
                <Center height={'100%'} width={'100%'}>
                    <Flex gap={2}>
                        <Icon as={MdError} h={10} w={10}></Icon>
                    </Flex>
                </Center>
            );
        }

        return this.props.children;
    }
}

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
            return <ErrorMessage heading="Something went wrong!" message="An error has occured." />;
        }   

        return this.props.children;
    }
}

export const AuthorizeError: React.FC = () => {
    return (
        <ErrorMessage
            isExternal
            heading="You aren't logged in!"
            message="To continue, you must login with Discord"
            button="Continue with Discord"
            link={`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify%20guilds`}
        />
    );
};
