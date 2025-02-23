"use client";
import { useEffect, useState } from 'react';

interface TableData {
  [table: string]: any[];
}

export default function DataEditor() {
  const [tables, setTables] = useState<TableData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/get-all-data');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setTables(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async (table: string, id: number, field: string, value: any) => {
    // ... keep existing implementation
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      {Object.entries(tables).map(([tableName, rows]) => {
        if (!Array.isArray(rows)) {
          console.error(`Invalid data format for table ${tableName}`);
          return null;
        }

        return (
          <div key={tableName} className="mb-8">
            <h2 className="text-xl font-bold mb-4">{tableName}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    {rows[0] && Object.keys(rows[0]).map((key) => (
                      <th key={key} className="p-2 border text-left">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {Object.entries(row).map(([key, value]) => (
                        <td key={key} className="p-2 border">
                          <EditableCell
                            table={tableName}
                            rowId={row.id}
                            field={key}
                            value={value}
                            onUpdate={handleUpdate}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EditableCell({ table, rowId, field, value, onUpdate }: any) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = async () => {
    await onUpdate(table, rowId, field, tempValue);
    setEditing(false);
  };

  return editing ? (
    <div className="flex gap-1">
      <input
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        className="px-1 border"
      />
      <button onClick={handleSave} className="px-2 bg-blue-100">✓</button>
      <button onClick={() => setEditing(false)} className="px-2 bg-red-100">✗</button>
    </div>
  ) : (
    <div onClick={() => setEditing(true)} className="min-h-[24px] cursor-pointer">
      {value ?? <span className="text-gray-400">null</span>}
    </div>
  );
}
