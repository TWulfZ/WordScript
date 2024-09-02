import { Label } from "@/components/ui/label";
import { UploadIcon, FileUpIcon, ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ColorBadge from "@components/ColorBadge";
import { Input } from "@/components/ui/input";
// App Main
import Info from "@components/App/Main/Info";
import AdvancedOptions from "@components/App/Main/AdvancedOptions";
import Summary from "@components/App/Main/Summary";

import { useEffect, useState } from "react";
import { useConfigStore, useDataStore } from "@/zustand/store";

interface Column {
  name: string;
  value: string;
}

const Main = () => {
  const { csvData, setCsvData } = useDataStore();
  const { fileName, setFileName } = useDataStore();
  const { columns, setColumns } = useConfigStore();
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);

  useEffect(() => {
    if (csvData.length > 0) {
      const cols = csvData[0].map<Column>((col) => {
        return { name: col, value: `{{${col}}}` };
      });

      setColumns(cols);
      setSelectedColumn(cols[0]);
    }
  }, [csvData]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // TODO: Use Tauri Read File API
      setCsvData([
        ["Nombre", "Email", "Respuesta 1", "Respuesta 2"],
        ["Juan Pérez", "juan@example.com", "Sí", "Opción A"],
      ]);
    }
  };

  const handleBadgeClick = (column: string) => {
    const selectedCol = columns.find((col) => col.name === column);
    setSelectedColumn(selectedCol!);
  };

  const handleColumnChange = (name: string, e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    console.log(newValue);

    const newCols = columns.map((col) => (col.name === name ? { ...col, value: newValue } : col));
    setColumns(newCols);

    if (selectedColumn?.name === name) {
      setSelectedColumn({ ...selectedColumn, value: newValue });
    }
  };

  return (
    <main className="transition-all duration-300 ease-in-out">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => document.getElementById("csv-upload")?.click()}>
            <UploadIcon className="mr-2 h-4 w-4" />
            Importar CSV
          </Button>
          <Input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          {fileName && <span className="text-sm text-muted-foreground">{fileName}</span>}
        </div>

        {csvData.length > 0 && (
          <>
            <div className="rounded-md bg-muted p-4">
              <h3 className="mb-2 flex items-center text-lg font-semibold">
                <ListIcon className="mr-2 h-5 w-5" />
                Resumen del CSV
              </h3>
              <div className="mb-2 flex items-center justify-between">
                <span>
                  Número de filas: <Badge variant="secondary">{csvData.length - 1}</Badge>
                </span>
                <span>
                  Número de columnas: <Badge variant="secondary">{csvData[0].length}</Badge>
                </span>
              </div>
              <div>
                <span className="font-medium">Columnas:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {csvData[0].map((columnName) => (
                    <Badge
                      key={columnName}
                      variant="outline"
                      className={`cursor-pointer ${
                        selectedColumn && selectedColumn.name === columnName ? "bg-blue-100 text-blue-800" : ""
                      }`}
                      onClick={() => handleBadgeClick(columnName)}
                    >
                      {columnName}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Marcador
                <Info title="Marcador de columna">
                  Este es el marcador que se utilizará en Word para buscar y reemplazar los valores de cada columna
                  donde se encuentre este texto. Por ejemplo:
                  <p className="mt-2">En tu documento Word</p>
                  <p className="my-1 border border-gray-200 p-2">
                    A nombre de <ColorBadge>{`{{nombre}}`}</ColorBadge>, respondio{" "}
                    <ColorBadge color="emerald">{`{{Respuesta 1}}`}</ColorBadge>
                  </p>
                  Procesado
                  <p className="my-1 border border-gray-200 p-2">
                    A nombre de <ColorBadge>{`John Doe`}</ColorBadge>, respondio{" "}
                    <ColorBadge color="emerald">{`Afirmativo`}</ColorBadge>
                  </p>
                </Info>
              </Label>

              {selectedColumn && (
                <div key={selectedColumn.name} className="flex items-center space-x-2">
                  <Input
                    value={selectedColumn.value}
                    className="flex-grow"
                    onChange={(e) => handleColumnChange(selectedColumn.name, e)}
                  />
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => document.getElementById("template-upload")?.click()}>
            <FileUpIcon className="mr-2 h-4 w-4" />
            Importar Plantilla
          </Button>
          <Input id="template-upload" type="file" accept=".docx" className="hidden" />
        </div>
        <AdvancedOptions />
      </div>
    </main>
  );
};

export default Main;

export { AdvancedOptions, Info, Summary };
