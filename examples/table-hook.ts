// import {ParkingModel} from '@/common/models/active-parkings/ParkingModel';
// import DateWithTime from '@/components/DateWithTime/DateWIthTime';
// import {useGetDateWithTime} from '@/hooks/useGetDateWithTime';
// import {useTable} from '@/hooks/useTable';
// import {createColumnHelper} from '@tanstack/react-table';
// import {useMemo} from 'react';
// import {useTranslation} from 'react-i18next';
// import ActiveParkingsRowActions from '../components/ActiveParkingsRowActions/ActiveParkingsRowActions';
// import Skeleton from 'react-loading-skeleton';
// import {useActiveParkingsQuery} from './useActiveParkingsQuery';

// interface UseActiveParkingsTableProps {
//   data: Array<ParkingModel>;
// }

// export const useActiveParkingsTable = ({data}: UseActiveParkingsTableProps) => {
//   const {isLoading} = useActiveParkingsQuery();
//   const {t} = useTranslation();
//   const getDateWithTime = useGetDateWithTime();
//   const columnHelper = createColumnHelper<ParkingModel>();
//   const columns = useMemo(
//     () => [
//       columnHelper.accessor('vehicle.vrn', {
//         id: 'VRN',
//         cell: (info) => info.getValue(),
//         header: () => <span>{t('table.vrn')}</span>,
//         sortingFn: 'alphanumeric',
//       }),
//       columnHelper.accessor('zone.zone_code', {
//         id: 'Zone',
//         cell: (info) => info.getValue(),
//         header: () => <span>{t('table.zone')}</span>,
//         sortingFn: 'basic',
//       }),
//       columnHelper.accessor('channel', {
//         id: 'Source',
//         cell: (info) => info.getValue(),
//         header: () => <span>{t('table.source')}</span>,
//       }),
//       columnHelper.accessor((row) => row.vehicle.label ?? '---', {
//         id: 'Vehicle Label',
//         cell: (info) => info.getValue(),
//         header: () => <span>{t('table.vehicleLabel')}</span>,
//       }),

//       columnHelper.accessor((row) => row.label ?? '---', {
//         id: 'Label',
//         cell: (info) => info.getValue(),
//         header: () => <span>{t('table.label')}</span>,
//       }),
//       columnHelper.accessor((row) => row.activity?.label ?? '---', {
//         id: 'Activity',
//         cell: (info) => info.getValue(),
//         header: () => <span>{t('table.activity')}</span>,
//       }),
//       columnHelper.accessor((row) => row.zone.location ?? '---', {
//         id: 'Street',
//         cell: (info) => info.getValue(),
//         header: () => <span>{t('table.street')}</span>,
//         sortingFn: 'alphanumeric',
//       }),
//       columnHelper.accessor((row) => row.zone.city ?? '---', {
//         id: 'City',
//         cell: (info) => info.getValue(),
//         header: () => <span>{t('table.city')}</span>,
//       }),
//       columnHelper.accessor('start_dt', {
//         id: 'Start Time',
//         cell: (info) => {
//           const {date, time} = getDateWithTime(info.getValue());

//           return <DateWithTime date={date} time={time} />;
//         },
//         header: () => <span>{t('table.startTime')}</span>,
//         sortingFn: 'datetime',
//       }),
//       columnHelper.accessor('pe_dt', {
//         id: 'End Time',
//         cell: (info) => {
//           const value = info.getValue();
//           if (!value) return <span className="active-parkings-table__not-set">Not set</span>;

//           const {date, time} = getDateWithTime(value);

//           return <DateWithTime date={date} time={time} />;
//         },
//         header: () => <span>{t('table.endTime')}</span>,
//         sortingFn: 'datetime',
//       }),
//       columnHelper.accessor('max_dt', {
//         id: 'Max End Time',
//         cell: (info) => {
//           const {date, time} = getDateWithTime(info.getValue());

//           return <DateWithTime date={date} time={time} />;
//         },
//         header: () => <span>{t('table.maxEndTime')}</span>,
//         sortingFn: 'datetime',
//       }),
//       columnHelper.accessor('id', {
//         id: 'Actions',
//         cell: (info) => <ActiveParkingsRowActions parking={info.row.original} />,
//         header: () => <></>,
//         enableSorting: false,
//       }),
//     ],
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [],
//   );

//   const tableColumns = useMemo(
//     () =>
//       isLoading
//         ? columns.map((column) => ({
//             ...column,
//             cell: () => <Skeleton height={30} />,
//           }))
//         : columns,
//     [isLoading, columns],
//   );

//   return useTable<ParkingModel>({
//     data,
//     columns: tableColumns,
//     tableName: 'activeParkings',
//   });
// };

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {useState} from 'react';

// import {TableName} from '@/store/table/tableSlice';
// import {
//   PaginationState,
//   TableOptions,
//   TableState,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
//   type ColumnDef,
//   type SortingState,
// } from '@tanstack/react-table';
// import {useColumnVisibility} from './useColumnVisibility';

// interface UseTableProps<T> extends Omit<TableOptions<T>, 'getCoreRowModel'> {
//   data: T[];
//   columns: ColumnDef<T, any>[];
//   tableName?: TableName | null;
//   extraState?: Partial<TableState>;
// }

// export const useTable = <T>({data, columns, tableName = null, extraState = {}, ...tableOptions}: UseTableProps<T>) => {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [filter, setFilter] = useState('');
//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 20,
//   });

//   const {columnVisibility, updateVisibility} = useColumnVisibility({tableName});

//   return useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     state: {
//       sorting,
//       columnVisibility,
//       globalFilter: filter,
//       pagination,
//       ...extraState,
//     },
//     onColumnVisibilityChange: (updater) => {
//       if (typeof updater === 'function') {
//         const newState = updater(columnVisibility);
//         updateVisibility(newState);
//       } else {
//         updateVisibility(updater);
//       }
//     },
//     onGlobalFilterChange: setFilter,
//     onSortingChange: setSorting,
//     onPaginationChange: setPagination,
//     debugTable: true,
//     meta: {
//       name: tableName,
//     },
//     ...tableOptions,
//   });
// };
