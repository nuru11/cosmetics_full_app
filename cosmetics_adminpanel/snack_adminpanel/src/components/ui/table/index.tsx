import { ReactNode, HTMLAttributes } from "react";

// -------------------- FIXED --------------------
// TableRow now accepts all native <tr> props, including onClick
interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
}

// TableCell props
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
  title?: string; // Native title attribute for tooltip
  colSpan?: number;
}

// Table, TableHeader, TableBody props
interface TableProps {
  children: ReactNode;
  className?: string;
}
interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}
interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

// -------------------- COMPONENTS --------------------
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full ${className}`}>{children}</table>;
};

const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// -------------------- FIXED TableRow --------------------
const TableRow: React.FC<TableRowProps> = ({ children, className, ...props }) => {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
};

// TableCell
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
  title,
  colSpan,
}) => {
  const CellTag = isHeader ? "th" : "td";
  const baseClassName = isHeader
    ? "px-5 py-3 text-left align-middle text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400"
    : "px-5 py-3.5 align-middle text-sm text-gray-700 dark:text-gray-300";
  return (
    <CellTag
      className={`${baseClassName} ${className ?? ""}`}
      title={title}
      colSpan={colSpan}
    >
      {children}
    </CellTag>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
