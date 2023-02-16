import { Box, Button, Center, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { Component, PropsWithChildren, ErrorInfo } from 'react';
import { MdError } from 'react-icons/md';
import { CLIENT_ID, REDIRECT_URI } from '../lib/constants';

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
            return (
                <Center height={'100%'} width={'100%'}>
                    <Flex gap={2}>
                        <Icon as={MdError} h={10} w={10}></Icon>
                        <Box>
                            <Heading size="md">Something went wrong.</Heading>
                            <Text size="md">Please try again.</Text>
                        </Box>
                    </Flex>
                </Center>
            );
        }

        return this.props.children;
    }
}

export class ErrorBoundary extends Component<PropsWithChildren, { hasError: boolean }> {
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
                        <Box>
                            <Heading size="md">Something went wrong.</Heading>
                            <Text size="md">Please try again.</Text>
                        </Box>
                    </Flex>
                </Center>
            );
        }

        return this.props.children;
    }
}

export function Authorize() {
    return (
        <Center height={'100%'} width={'100%'}>
            <Flex gap={2}>
                <Icon as={MdError} h={10} w={10}></Icon>
                <Box>
                    <Heading size="md">You need to login!</Heading>
                    <Text size="md">To continue, you must authorize with Discord.</Text>
                    <Button
                        as="a"
                        marginTop={2}
                        href={`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify%20guilds`}
                        colorScheme="brand"
                    >
                        Continue with Discord.
                    </Button>
                </Box>
            </Flex>
        </Center>
        // <div className="Utils__NoticeBox">
        //     <div>
        //         <h2 className="headingTwo leading">You need to login.</h2>
        //         <p className="leading">To continue, you must authorize with Discord.</p>
        //         <a
        //             href={`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify%20guilds`}
        //             className="Button Button--Primary"
        //         >
        //             Continue with Discord
        //         </a>
        //     </div>
        // </div>
    );
}
