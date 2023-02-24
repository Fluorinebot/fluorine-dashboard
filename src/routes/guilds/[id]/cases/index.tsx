import AvatarWithName from '#/components/AvatarWithName';
import { AuthorizeError, ErrorMessage } from '#/components/ErrorBoundary';
import { BASE_URI } from '#/lib/constants';
import type { Case } from '#/lib/types';
import useAPI from '#/lib/useAPI';
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Center,
    Flex,
    Heading,
    IconButton,
    Link,
    Spinner,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr
} from '@chakra-ui/react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    Table as TableType,
    useReactTable
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import {
    MdArrowDownward,
    MdArrowUpward,
    MdChevronLeft,
    MdChevronRight,
    MdFirstPage,
    MdLastPage,
    MdOpenInNew
} from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import { Link as RouteTo, useParams } from 'react-router-dom';

function toTitleCase(str: string) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}

const TableNavigation: React.FC<{ table: TableType<Case> }> = ({ table }) => {
    return (
        <Flex alignItems="center" justifyContent={'center'} gap="2">
            <IconButton
                icon={<MdFirstPage size="24" />}
                aria-label="First page"
                onClick={() => table.setPageIndex(0)}
                isDisabled={!table.getCanPreviousPage()}
            />
            <IconButton
                icon={<MdChevronLeft size="24" />}
                aria-label="Previous page"
                onClick={() => table.previousPage()}
                isDisabled={!table.getCanPreviousPage()}
            />
            <p>
                Page
                <b>
                    {' '}
                    {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </b>
            </p>
            <IconButton
                icon={<MdChevronRight size="24" />}
                aria-label="Next page"
                onClick={() => table.nextPage()}
                isDisabled={!table.getCanNextPage()}
            />
            <IconButton
                icon={<MdLastPage size="24" />}
                aria-label="Last page"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                isDisabled={!table.getCanNextPage()}
            />
        </Flex>
    );
};

export default function Cases() {
    const params = useParams();
    const { loading, data: caseData, code, error } = useAPI<Case[]>(`${BASE_URI}/guilds/${params.id}/cases`);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const columnHelper = createColumnHelper<Case>();
    const [sorting, setSorting] = useState<SortingState>([{ id: 'caseId', desc: true }]);

    let columns = [
        columnHelper.accessor('caseId', {
            header: 'Case ID',
            cell: cell => (
                <Link as={RouteTo} to={`/guilds/${cell.row.original.guildId}/cases/${cell.getValue()}`} color="brand">
                    {cell.getValue()}
                </Link>
            )
        }),
        columnHelper.accessor('type', {
            header: 'Case Type',
            cell: ({ getValue }) => {
                return useMemo(() => toTitleCase(getValue()), [getValue()]);
            }
        }),
        columnHelper.accessor('caseCreator', {
            header: 'Moderator',
            cell: ({ getValue, row }) => {
                return useMemo(
                    () => <AvatarWithName guildId={row.original.guildId} userId={getValue()} />,
                    [getValue()]
                );
            }
        }),
        columnHelper.accessor('moderatedUser', {
            header: 'Offender',
            cell: ({ getValue, row }) => {
                return useMemo(
                    () => <AvatarWithName guildId={row.original.guildId} userId={getValue()} />,
                    [getValue()]
                );
            }
        })
    ];

    const data = useMemo(() => {
        return caseData ?? [];
    }, [caseData]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting
        },
        enableMultiSort: true,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    if (loading) {
        return (
            <Center width="100%" height="100vh">
                <Spinner size="xl" color="fixedBlue.100" />
            </Center>
        );
    }

    if (error) {
        if (code === 401) {
            return <AuthorizeError />;
        }

        return (
            <ErrorMessage
                heading="Something went wrong"
                message="The cases for this server could not be loaded."
                link="/guilds"
            />
        );
    }

    if (caseData) {
        if (isMobile) {
            return (
                <>
                    <Flex direction={'column'} gap={2} marginBottom={4}>
                        <Heading as="h2" size="xl" fontWeight={800}>
                            Cases
                        </Heading>
                        <Text size="md" fontWeight={400}>
                            View all moderation cases logged for this server.
                        </Text>
                    </Flex>
                    <Flex gap={2} direction={'column'}>
                        {table.getRowModel().rows.map(currCase => (
                            <Card key={currCase.original.caseId}>
                                <CardHeader>
                                    <Flex gap={2} justifyContent="space-between" alignItems="center">
                                        <Text size="md" fontWeight={600}>
                                            Case #{currCase.original.caseId}
                                        </Text>

                                        <RouteTo
                                            to={`/guilds/${currCase.original.guildId}/cases/${currCase.original.caseId}`}
                                        >
                                            <IconButton aria-label="Open Case" size="sm" icon={<MdOpenInNew />} />
                                        </RouteTo>
                                    </Flex>
                                </CardHeader>
                                <CardBody>
                                    <Flex gap={3} direction={'column'}>
                                        <Flex>
                                            <Text size="md" fontWeight={600} flex="25%" color="gray" marginBlock="auto">
                                                Moderator
                                            </Text>
                                            <Box flex="75%">
                                                <AvatarWithName
                                                    guildId={currCase.original.guildId}
                                                    userId={currCase.original.caseCreator}
                                                />
                                            </Box>
                                        </Flex>
                                        <Flex>
                                            <Text size="md" fontWeight={600} flex="25%" color="gray" marginBlock="auto">
                                                Offending User
                                            </Text>
                                            <Box flex="75%">
                                                <AvatarWithName
                                                    guildId={currCase.original.guildId}
                                                    userId={currCase.original.moderatedUser}
                                                />
                                            </Box>
                                        </Flex>
                                    </Flex>
                                </CardBody>
                            </Card>
                        ))}
                    </Flex>
                </>
            );
        }

        return (
            <Flex direction={'column'} gap={2} marginBottom={4}>
                <Heading as="h2" size="xl" fontWeight={800}>
                    Cases
                </Heading>
                <Text size="md" fontWeight={400}>
                    View all moderation cases logged for this server.
                </Text>

                <TableContainer>
                    <Table variant="simple" maxWidth={'100%'}>
                        <Thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <Th
                                            key={header.id}
                                            cursor={
                                                {
                                                    [`${header.column.getCanSort()}`]: 'pointer',
                                                    [`${!header.column.getCanSort()}`]: 'not-allowed'
                                                }['true']
                                            }
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <Flex gap={2}>
                                                <Box as="span" marginBlock={'auto'}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column.columnDef.header,
                                                              header.getContext()
                                                          )}
                                                </Box>
                                                {{
                                                    asc: <MdArrowUpward />,
                                                    desc: <MdArrowDownward />
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </Flex>
                                        </Th>
                                    ))}
                                </Tr>
                            ))}
                        </Thead>

                        <Tbody>
                            {table.getRowModel().rows.length > 0 &&
                                table.getRowModel().rows.map(row => (
                                    <Tr key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <Td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </Td>
                                        ))}
                                    </Tr>
                                ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                {table.getRowModel().rows.length === 0 && (
                    <p className="CasesTable__NoCases">There are no cases to show.</p>
                )}
                <TableNavigation table={table} />
            </Flex>
        );
    }

    return <></>;
}
