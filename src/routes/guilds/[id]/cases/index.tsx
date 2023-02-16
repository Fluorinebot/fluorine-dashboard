import '#/assets/routes/guilds/[id]/cases/index.css';
import AvatarWithName from '#/components/AvatarWithName';
import { AuthorizeError } from '#/components/ErrorBoundary';
import { BASE_URI } from '#/lib/constants';
import type { Case } from '#/lib/types';
import useAPI from '#/lib/useAPI';
import { Box, Flex, Heading, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
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
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import { Link, Outlet, useParams } from 'react-router-dom';

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
        <div className="CasesPagination">
            <button
                className="Button Button--Secondary"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
            >
                {'<<'}
            </button>
            <button
                className="Button Button--Secondary"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                {'<'}
            </button>
            <p>
                Page
                <b>
                    {' '}
                    {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </b>
            </p>
            <button
                className="Button Button--Secondary"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                {'>'}
            </button>
            <button
                className="Button Button--Secondary"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
            >
                {'>>'}
            </button>
        </div>
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
                <>
                    {cell.getValue()}{' '}
                    <Link
                        className="Utils__FluorineBlue"
                        to={`/guilds/${cell.row.original.guildId}/cases/${cell.getValue()}`}
                    >
                        Open
                    </Link>
                </>
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
        }),
        columnHelper.accessor('reason', {
            header: 'Case Reason',
            cell: ({ getValue }) => {
                return (
                    <Box as="span" wordBreak="break-all">
                        {getValue()}
                    </Box>
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
        return <Spinner />;
    }

    if (error) {
        if (code === 401) {
            return <AuthorizeError />;
        }

        return <p className="Utils__NoticeBox container">There was an error loading the cases, try again.</p>;
    }

    if (caseData) {
        if (params.item) {
            return <Outlet />;
        }

        if (isMobile) {
            return (
                <>
                    <Flex direction={'column'} gap={2} marginBottom={4}>
                        <Heading as="h2" size="xl" fontWeight={800}>
                            Cases
                        </Heading>
                        <Text size="md" fontWeight={400}>
                            View all moderation cases logged for this server. (you're on mobile thats why no cases! )
                        </Text>
                    </Flex>
                </>
            );
        }

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

                <TableContainer>
                    <Table variant="simple" width={'100%'} overflowY="hidden">
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
            </>
        );
    }

    return <></>;
}
