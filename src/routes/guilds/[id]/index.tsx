import { AuthorizeError, ErrorMessage } from '#/components/ErrorBoundary';
import { Box, Center, Flex, Heading, Icon, Spinner, Text, UseDisclosureReturn } from '@chakra-ui/react';
import Sidebar from '#/components/Sidebar';
import TabsList from '#/components/sidebars/TabsList';
import { BASE_URI } from '#/lib/constants';
import { RenderingContext } from '#/lib/RenderContext';
import useAPI from '#/lib/useAPI';
import { useContext } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { MdError } from 'react-icons/md';

const getIcon = (id: string, icon?: string) =>
    icon
        ? `https://cdn.discordapp.com/icons/${id}/${icon}.${icon.endsWith('_a') ? 'gif' : 'webp'}?size=48`
        : `https://cdn.discordapp.com/embed/avatars/${BigInt(id) % BigInt(5)}.png?size=48`;

const Guild: React.FC<{ disclosureProps: UseDisclosureReturn }> = ({ disclosureProps }) => {
    const params = useParams();
    const { data, error, loading, code } = useAPI<any>(`${BASE_URI}/guilds/${params.id}`);

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    let jsx;

    if (loading) {
        jsx = <Spinner />;
    }

    if (error) {
        if (code === 401) {
            jsx = <AuthorizeError />;
        } else if (code === 403) {
            jsx = (
                <ErrorMessage
                    heading="Not Allowed!"
                    message="You are not allowed to edit that server."
                    button="Go back"
                    link="/guilds"
                    isInternal
                />
            );
        } else if (code === 404) {
            jsx = (
                <ErrorMessage
                    heading="Not Found!"
                    message="That server does not exist, or does not have Fluorine."
                    button="Go back"
                    link="/guilds"
                    isInternal
                />
            );
        } else {
            jsx = <ErrorMessage heading="Something went wrong!" message="Please try again." isInternal />;
        }
    }

    if (data) {
        jsx = (
            <>
                <Outlet />
            </>
        );
    }

    return (
        <Box overflowY="hidden">
            {isMobile ? (
                <Box>
                    <Sidebar disclosureProps={disclosureProps}>
                        <TabsList
                            data={data}
                            error={error}
                            loading={loading}
                            code={code}
                            id={params.id}
                            isGuildBackURI={Boolean(params.item)}
                        />
                    </Sidebar>

                    <Box as="main" padding={4}>
                        <Outlet />
                    </Box>
                </Box>
            ) : (
                <Flex overflowY="hidden" height="100vh">
                    <Box flex="20%" height="100vh">
                        <Sidebar disclosureProps={disclosureProps}>
                            <TabsList
                                data={data}
                                error={error}
                                loading={loading}
                                code={code}
                                id={params.id}
                                isGuildBackURI={Boolean(params.item)}
                            />
                        </Sidebar>
                    </Box>
                    <Box as="main" flex="80%" padding={4} maxHeight="100vh" overflowY="scroll">
                        <Box>{jsx}</Box>
                    </Box>
                </Flex>
            )}
        </Box>
    );
};

export default Guild;
