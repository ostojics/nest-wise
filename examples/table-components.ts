// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {useTableContext} from '@/hooks/useTableContext';
// import {Row} from '@tanstack/react-table';
// import {defaultRowRenderer} from './defaultRowRenderer';
// import TableSearchResults from '../TableSearchResults/TableSearchResults';
// import {Row, flexRender} from '@tanstack/react-table';

// interface DefaultTableBodyProps {
//   rowRenderer?: (row: Row<any>) => React.ReactElement;
//   zeroState: React.ReactElement;
//   noSearchResultsSate?: React.ReactElement;
// }

// const DefaultTableBody = ({
//   rowRenderer = defaultRowRenderer,
//   zeroState,
//   noSearchResultsSate = <TableSearchResults />,
// }: DefaultTableBodyProps) => {
//   const {table} = useTableContext();
//   const rowsLength = table.getRowModel().rows.length;
//   const columnFilters = table.getState().columnFilters;
//   const globalFilters = table.getState().globalFilter;

//   if (rowsLength === 0 && (columnFilters.length > 0 || globalFilters != ''))
//     return <tbody className="default-table-body">{noSearchResultsSate}</tbody>;

//   if (rowsLength === 0) return <tbody className="default-table-body">{zeroState}</tbody>;

//   return <tbody className="default-table-body">{table.getRowModel().rows.map((row) => rowRenderer(row))}</tbody>;
// };

// export default DefaultTableBody;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const defaultRowRenderer = (row: Row<any>) => {
//   return (
//     <tr key={row.id} className="default-table-body__row">
//       {row.getVisibleCells().map((cell) => (
//         <td className="default-table-body__cell" key={cell.id}>
//           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//         </td>
//       ))}
//     </tr>
//   );
// };

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {useTableContext} from '@/hooks/useTableContext';
// import {HeaderGroup} from '@tanstack/react-table';
// import {defaultHeaderGroupRenderer} from './defaultHeaderGroupRenderer';

// interface DefaultTableHeaderProps {
//   headerGroupRenderer?: (headerGroup: HeaderGroup<any>) => React.ReactElement;
// }

// const DefaultTableHeader = ({headerGroupRenderer = defaultHeaderGroupRenderer}: DefaultTableHeaderProps) => {
//   const {table} = useTableContext();

//   return (
//     <thead className="default-table-header">
//       {table.getHeaderGroups().map((headerGroup) => headerGroupRenderer(headerGroup))}
//     </thead>
//   );
// };

// export default DefaultTableHeader;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {Header, HeaderGroup, flexRender} from '@tanstack/react-table';
// import Button from '../Button/Button';
// import {IconProp} from '@fortawesome/fontawesome-svg-core';
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

// export const defaultHeaderGroupRenderer = (headerGroup: HeaderGroup<any>) => {
//   return (
//     <tr key={headerGroup.id} className="default-table-header__row">
//       {headerGroup.headers.map((header: Header<any, unknown>) => (
//         <th key={header.id} className="default-table-header__cell">
//           <div className="default-table-header__cell-container">
//             {header.isPlaceholder ? null : (
//               <>
//                 {header.column.getCanSort() ? (
//                   <Button
//                     className="default-table-header__sort"
//                     variant="icon"
//                     onClick={header.column.getToggleSortingHandler()}
//                     aria-label="Sort column"
//                   >
//                     {flexRender(header.column.columnDef.header, header.getContext())}
//                     <FontAwesomeIcon
//                       className="default-table-header__sort-icon"
//                       icon={'fa-solid fa-sort' as IconProp}
//                     />
//                   </Button>
//                 ) : (
//                   <div className="default-table-header__title">
//                     {flexRender(header.column.columnDef.header, header.getContext())}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </th>
//       ))}
//     </tr>
//   );
// };

// table components example usage

// import DefaultTable from '@/components/DefaultTable/DefaultTable';
// import DefaultTableBody from '@/components/DefaultTableBody/DefaultTableBody';
// import DefaultTableHeader from '@/components/DefaultTableHeader/DefaultTableHeader';
// import ActiveParkingsZeroState from '../ActiveParkingsZeroState/ActiveParkingsZeroState';

// const ActiveParkingsTable = () => {
//   return (
//     <div>
//       <DefaultTable className="active-parkings-table">
//         <>
//           <DefaultTableHeader />
//           <DefaultTableBody zeroState={<ActiveParkingsZeroState />} />
//         </>
//       </DefaultTable>
//     </div>
//   );
// };

// export default ActiveParkingsTable;

// import TableSearch from '@/components/TableSearch/TableSearch';
// import {TableProvider} from '@/context/TableContext';
// import TableLayout from '@/layouts/TableLayout/TableLayout';
// import {useActiveParkingsTable} from '../../hooks/useActiveParkingsTable';
// import ActiveParkingsTable from '../ActiveParkingsTable/ActiveParkingsTable';
// import ToggleColumns from '@/components/ToggleColumns/ToggleColumns';
// import {ParkingModel} from '@/common/models/active-parkings/ParkingModel';

// interface ActiveParkingsContentProps {
//   data: Array<ParkingModel>;
// }

// const ActiveParkingsContent = ({data}: ActiveParkingsContentProps) => {
//   const table = useActiveParkingsTable({data});

//   return (
//     <TableProvider table={table}>
//       <section className="active-parkings-content">
//         <div className="active-parkings-content__controls">
//           <TableSearch />
//           <ToggleColumns columnsIncludeList={['Vehicle Label', 'Street', 'Label', 'City', 'Activity']} />
//         </div>
//         <TableLayout>
//           <ActiveParkingsTable />
//         </TableLayout>
//       </section>
//     </TableProvider>
//   );
// };

// export default ActiveParkingsContent;

// import ActiveParkingsContent from '@/features/active-parkings/components/ActiveParkingsContent/ActiveParkingsContent';
// import {useGetActiveParkings} from '@/features/active-parkings/hooks/useGetActiveParkings';
// import {useCreateTableDataRef} from '@/hooks/useCreateTableDataRef';

// const ActiveParkings = () => {
//   const {data, isLoading} = useGetActiveParkings();
//   const tableData = useCreateTableDataRef(data?.data, isLoading);

//   return <ActiveParkingsContent data={tableData} />;
// };

// export default ActiveParkings;
