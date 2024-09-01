import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UploadIcon, FileTextIcon, FileUpIcon, ListIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Info from "./components/Info";
import ColorBadge from "./components/ColorBadge";
import AdvancedOptions from "./components/AdvancedOptions";
import { cn } from "@/lib/utils";

interface Column {
  name: string;
  value: string;
}

export default function App() {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [columns, setColumns] = useState<Column[]>([]);
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

  const handleColumnChange = (
    name: string,
    e: React.FormEvent<HTMLInputElement>
  ) => {
    const newValue = e.currentTarget.value;
    console.log(newValue);

    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.name === name ? { ...col, value: newValue } : col
      )
    );

    if (selectedColumn?.name === name) {
      setSelectedColumn({ ...selectedColumn, value: newValue });
    }
  };

  return (
    <div className="w-full h-full">
      <Card className="w-full h-full min-h-screen">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[4rem]">
            <img
              src="/wordscript-text.svg"
              alt="WordScript Logo"
              className="h-20"
            ></img>
          </CardTitle>

          <CardDescription>
            Importa datos CSV de Google Forms y genera documentos de Word con
            plantillas personalizadas
          </CardDescription>
        </CardHeader>

        <CardContent className="transition-all duration-300 ease-in-out">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => document.getElementById("csv-upload")?.click()}
              >
                <UploadIcon className="mr-2 h-4 w-4" />
                Importar CSV
              </Button>
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
              {fileName && (
                <span className="text-sm text-muted-foreground">
                  {fileName}
                </span>
              )}
            </div>

            {csvData.length > 0 && (
              <>
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <ListIcon className="mr-2 h-5 w-5" />
                    Resumen del CSV
                  </h3>
                  <div className="flex justify-between items-center mb-2">
                    <span>
                      Número de filas:{" "}
                      <Badge variant="secondary">{csvData.length - 1}</Badge>
                    </span>
                    <span>
                      Número de columnas:{" "}
                      <Badge variant="secondary">{csvData[0].length}</Badge>
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Columnas:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {csvData[0].map((columnName) => (
                        <Badge
                          key={columnName}
                          variant="outline"
                          className={`cursor-pointer ${
                            selectedColumn && selectedColumn.name === columnName
                              ? "bg-blue-100 text-blue-800"
                              : ""
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
                  <Label className="flex items-center  gap-2">
                    Marcador
                    <Info title="Marcador de columna">
                      Este es el marcador que se utilizará en Word para buscar y
                      reemplazar los valores de cada columna donde se encuentre
                      este texto. Por ejemplo:
                      <p className="mt-2">En tu documento Word</p>
                      <p className="p-2 my-1 border border-gray-200">
                        A nombre de <ColorBadge>{`{{nombre}}`}</ColorBadge>,
                        respondio{" "}
                        <ColorBadge color="emerald">{`{{Respuesta 1}}`}</ColorBadge>
                      </p>
                      Procesado
                      <p className="p-2 my-1 border border-gray-200">
                        A nombre de <ColorBadge>{`John Doe`}</ColorBadge>,
                        respondio{" "}
                        <ColorBadge color="emerald">{`Afirmativo`}</ColorBadge>
                      </p>
                    </Info>
                  </Label>

                  {selectedColumn && (
                    <div
                      key={selectedColumn.name}
                      className="flex items-center space-x-2"
                    >
                      <Input
                        value={selectedColumn.value}
                        className="flex-grow"
                        onChange={(e) =>
                          handleColumnChange(selectedColumn.name, e)
                        }
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() =>
                  document.getElementById("template-upload")?.click()
                }
              >
                <FileUpIcon className="mr-2 h-4 w-4" />
                Importar Plantilla
              </Button>
              <Input
                id="template-upload"
                type="file"
                accept=".docx"
                className="hidden"
              />
            </div>
            <AdvancedOptions />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end transition-all duration-300 ease-in-out">
          <Button
            disabled={csvData.length === 0 || Object.keys(columns).length === 0}
          >
            <FileTextIcon className="mr-2 h-4 w-4" />
            Generar Documentos
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
