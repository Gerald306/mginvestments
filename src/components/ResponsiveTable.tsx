import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronUp, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
  mobileHidden?: boolean;
}

interface ResponsiveTableProps {
  data: any[];
  columns: Column[];
  title?: string;
  searchable?: boolean;
  filterable?: boolean;
  actions?: {
    view?: (row: any) => void;
    edit?: (row: any) => void;
    delete?: (row: any) => void;
    custom?: Array<{
      label: string;
      icon?: React.ReactNode;
      onClick: (row: any) => void;
      variant?: 'default' | 'destructive' | 'outline';
    }>;
  };
  emptyMessage?: string;
  loading?: boolean;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  data,
  columns,
  title,
  searchable = false,
  filterable = false,
  actions,
  emptyMessage = "No data available",
  loading = false
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const filteredData = data.filter(row => {
    if (!searchQuery) return true;
    return Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const visibleColumns = columns.filter(col => !col.mobileHidden);
  const hiddenColumns = columns.filter(col => col.mobileHidden);

  if (loading) {
    return (
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {(title || searchable || filterable) && (
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {title && <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>}
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
              )}
              
              {filterable && (
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="p-0">
        {sortedData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                        }`}
                        style={{ width: column.width }}
                        onClick={() => column.sortable && handleSort(column.key)}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.label}</span>
                          {column.sortable && sortColumn === column.key && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-4 w-4" /> : 
                              <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </th>
                    ))}
                    {actions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {columns.map((column) => (
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {column.render ? column.render(row[column.key], row) : row[column.key]}
                        </td>
                      ))}
                      {actions && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {actions.view && (
                              <Button variant="ghost" size="sm" onClick={() => actions.view!(row)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {actions.edit && (
                              <Button variant="ghost" size="sm" onClick={() => actions.edit!(row)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {actions.delete && (
                              <Button variant="ghost" size="sm" onClick={() => actions.delete!(row)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                            {actions.custom?.map((action, actionIndex) => (
                              <Button
                                key={actionIndex}
                                variant={action.variant || "ghost"}
                                size="sm"
                                onClick={() => action.onClick(row)}
                              >
                                {action.icon}
                                <span className="ml-1">{action.label}</span>
                              </Button>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
              {sortedData.map((row, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-4">
                    {/* Main visible data */}
                    <div className="space-y-3">
                      {visibleColumns.map((column) => (
                        <div key={column.key} className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-500">{column.label}:</span>
                          <span className="text-sm text-gray-900 text-right flex-1 ml-2">
                            {column.render ? column.render(row[column.key], row) : row[column.key]}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Expandable hidden data */}
                    {hiddenColumns.length > 0 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(index)}
                          className="w-full mt-3 text-blue-600"
                        >
                          {expandedRows.has(index) ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Show More
                            </>
                          )}
                        </Button>

                        {expandedRows.has(index) && (
                          <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                            {hiddenColumns.map((column) => (
                              <div key={column.key} className="flex justify-between items-start">
                                <span className="text-sm font-medium text-gray-500">{column.label}:</span>
                                <span className="text-sm text-gray-900 text-right flex-1 ml-2">
                                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {/* Mobile Actions */}
                    {actions && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-200">
                        {actions.view && (
                          <Button variant="outline" size="sm" onClick={() => actions.view!(row)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                        {actions.edit && (
                          <Button variant="outline" size="sm" onClick={() => actions.edit!(row)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )}
                        {actions.delete && (
                          <Button variant="outline" size="sm" onClick={() => actions.delete!(row)}>
                            <Trash2 className="h-4 w-4 mr-1 text-red-500" />
                            Delete
                          </Button>
                        )}
                        {actions.custom?.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            variant={action.variant || "outline"}
                            size="sm"
                            onClick={() => action.onClick(row)}
                          >
                            {action.icon}
                            <span className="ml-1">{action.label}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponsiveTable;
