import AvatarWithName from '#/components/AvatarWithName';
import type { Case } from '#/lib/types';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    Table,
    useReactTable
} from '@tanstack/react-table';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

function toTitleCase(str: string) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}

const TableNavigation: React.FC<{ table: Table<Case> }> = ({ table }) => {
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

const CasesTable: React.FC<{ caseData: Case[] }> = ({ caseData }) => {
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
            header: 'Case Reason'
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

    return (
        <>
            <table className="CasesTable">
                <thead role="rowgroup">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header =>
                                isMobile && header.id === 'reason' ? null : (
                                    <th
                                        key={header.id}
                                        className={classNames('CasesTable__Header', {
                                            'CasesTable__Header--Sortable': header.column.getCanSort(),
                                            'CasesTable__Header--NotSortable': !header.column.getCanSort(),
                                            'CasesTable__Header--Sorted': header.column.getIsSorted()
                                        })}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <span className="Utils__TextAlign">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </span>
                                        {{
                                            asc: <FaArrowUp />,
                                            desc: <FaArrowDown />
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </th>
                                )
                            )}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {table.getRowModel().rows.length > 0 &&
                        table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => {
                                    if (cell.id.split('_')[1] === 'reason' && isMobile) {
                                        return;
                                    }

                                    return (
                                        <td
                                            key={cell.id}
                                            className={`CasesTable__Row CasesTable__${cell.id.split('_')[1]}`}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                </tbody>
            </table>
            {table.getRowModel().rows.length === 0 && (
                <p className="CasesTable__NoCases">There are no cases to show.</p>
            )}
            <TableNavigation table={table} />
        </>
    );
};

export default CasesTable;
